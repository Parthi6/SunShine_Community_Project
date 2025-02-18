import Attendance from '../models/attendanceModel.js';
import Student from '../models/studentModel.js';
import ErrorHandler from '../utils/errorHandler.js';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import mongoose from 'mongoose';

// Mark attendance for multiple students
export const markAttendance = catchAsyncErrors(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { date, records } = req.body;

        if (!date || !records || !Array.isArray(records) || records.length === 0) {
            return next(new ErrorHandler('Invalid attendance data', 400));
        }

        // Get all student IDs
        const studentIds = records.map(record => record.studentId);

        // Validate all students exist
        const students = await Student.find({ _id: { $in: studentIds } }).session(session);
        if (students.length !== studentIds.length) {
            await session.abortTransaction();
            return next(new ErrorHandler('One or more students not found', 400));
        }

        const studentMap = new Map(students.map(s => [s._id.toString(), s]));

        // Delete existing attendance records for these students on this date
        const startOfDay = new Date(new Date(date).setHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date(date).setHours(23, 59, 59, 999));

        await Attendance.deleteMany({
            student: { $in: studentIds },
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).session(session);

        // Prepare attendance records
        const attendanceRecords = records.map(record => ({
            student: record.studentId,
            date: new Date(date),
            status: record.status,
            class: studentMap.get(record.studentId).class
        }));

        // Insert all records at once
        const savedRecords = await Attendance.insertMany(attendanceRecords, { session });

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: 'Attendance marked successfully',
            attendanceRecords: savedRecords
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Attendance marking error:', error);
        return next(new ErrorHandler(error.message || 'Error marking attendance', 500));
    } finally {
        session.endSession();
    }
});

// Get attendance by date
export const getAttendanceByDate = catchAsyncErrors(async (req, res, next) => {
    const { date } = req.params;
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
        date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    }).populate('student', 'name class photo');

    res.status(200).json({
        success: true,
        attendance
    });
});

// Get attendance by class
export const getAttendanceByClass = catchAsyncErrors(async (req, res, next) => {
    const { className } = req.params;
    const { startDate, endDate } = req.query;

    const query = { class: className };

    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    const attendance = await Attendance.find(query)
        .populate('student', 'name photo')
        .sort({ date: -1 });

    res.status(200).json({
        success: true,
        attendance
    });
});

// Get attendance analytics
export const getAttendanceAnalytics = catchAsyncErrors(async (req, res, next) => {
    const { startDate, endDate } = req.query;

    const analytics = await Attendance.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    status: "$status",
                    class: "$class"
                },
                count: { $sum: 1 }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        analytics
    });
});

// Get all attendance records
export const getAllAttendance = catchAsyncErrors(async (req, res, next) => {
    const attendance = await Attendance.find()
        .populate('studentId', 'name')
        .sort({ date: -1 });

    res.status(200).json({
        success: true,
        attendance
    });
});

// Get attendance by student
export const getAttendanceByStudent = catchAsyncErrors(async (req, res, next) => {
    const { studentId } = req.params;
    const attendance = await Attendance.find({ studentId })
        .sort({ date: -1 });

    res.status(200).json({
        success: true,
        attendance
    });
});

// Update attendance
export const updateAttendance = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let attendance = await Attendance.findById(id);

    if (!attendance) {
        return next(new ErrorHandler("Attendance record not found", 404));
    }

    attendance = await Attendance.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        attendance
    });
});

// Delete attendance
export const deleteAttendance = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const attendance = await Attendance.findById(id);

    if (!attendance) {
        return next(new ErrorHandler("Attendance record not found", 404));
    }

    await attendance.deleteOne();

    res.status(200).json({
        success: true,
        message: "Attendance record deleted successfully"
    });
});

// Get weekly attendance trend
export const getWeeklyTrend = catchAsyncErrors(async (req, res, next) => {
    const { date } = req.query;
    const endDate = date ? new Date(date) : new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 4);

    // First get total students per day
    const totalStudentsPerDay = await Student.aggregate([
        {
            $group: {
                _id: null,
                totalStudents: { $sum: 1 }
            }
        }
    ]);

    const totalStudents = totalStudentsPerDay[0]?.totalStudents || 0;

    const weeklyData = await Attendance.aggregate([
        {
            $match: {
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $addFields: {
                // Convert 'Late' to 'Present' for calculation
                effectiveStatus: {
                    $cond: [
                        { $eq: ["$status", "Late"] },
                        "Present",
                        "$status"
                    ]
                }
            }
        },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    status: "$effectiveStatus"
                },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: "$_id.date",
                attendance: {
                    $push: {
                        status: "$_id.status",
                        count: "$count"
                    }
                }
            }
        },
        {
            $project: {
                date: "$_id",
                attendanceRate: {
                    $multiply: [
                        {
                            $divide: [
                                {
                                    $sum: {
                                        $map: {
                                            input: "$attendance",
                                            as: "a",
                                            in: {
                                                $cond: [
                                                    { $eq: ["$$a.status", "Present"] },
                                                    "$$a.count",
                                                    0
                                                ]
                                            }
                                        }
                                    }
                                },
                                totalStudents
                            ]
                        },
                        100
                    ]
                }
            }
        },
        { $sort: { date: 1 } }
    ]);

    // Fill in missing dates with 0%
    const allDates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        if (d.getDay() !== 0 && d.getDay() !== 6) { // Skip weekends
            allDates.push(d.toISOString().split('T')[0]);
        }
    }

    const filledData = allDates.map(date => {
        const existingData = weeklyData.find(d => d.date === date);
        return existingData || { date, attendanceRate: 0 };
    });

    res.status(200).json({
        success: true,
        weeklyTrend: filledData
    });
});

// Get class-wise attendance
export const getClasswiseAttendance = catchAsyncErrors(async (req, res, next) => {
    const { date, class: className } = req.query;
    const queryDate = date ? new Date(date) : new Date();

    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

    const matchQuery = {
        date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    };

    if (className && className !== 'all') {
        matchQuery.class = className;
    }

    const classwiseData = await Attendance.aggregate([
        {
            $match: matchQuery
        },
        {
            $addFields: {
                // Convert 'Late' to 'Present' for calculation
                effectiveStatus: {
                    $cond: [
                        { $eq: ["$status", "Late"] },
                        "Present",
                        "$status"
                    ]
                }
            }
        },
        {
            $group: {
                _id: {
                    class: "$class",
                    status: "$effectiveStatus"
                },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: "$_id.class",
                attendance: {
                    $push: {
                        status: "$_id.status",
                        count: "$count"
                    }
                }
            }
        }
    ]);

    const formattedData = {
        present: [],
        absent: []
    };

    const classes = ['Toddler', 'PreK-1', 'PreK-2', 'Kindergarten'];
    classes.forEach(cls => {
        const classData = classwiseData.find(item => item._id === cls) || { attendance: [] };
        // Count both 'Present' and 'Late' as present
        const present = classData.attendance.find(a => a.status === 'Present')?.count || 0;
        const absent = classData.attendance.find(a => a.status === 'Absent')?.count || 0;
        
        formattedData.present.push(present);
        formattedData.absent.push(absent);
    });

    res.status(200).json({
        success: true,
        classwiseData: formattedData
    });
});