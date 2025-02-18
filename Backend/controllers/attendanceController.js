import { Attendance } from "../models/attendanceSchema.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

// Mark attendance
export const markAttendance = catchAsyncErrors(async (req, res, next) => {
    const { studentId, date, status, remarks } = req.body;

    const attendance = await Attendance.create({
        studentId,
        date,
        status,
        remarks
    });

    res.status(201).json({
        success: true,
        attendance
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

// Get attendance by date
export const getAttendanceByDate = catchAsyncErrors(async (req, res, next) => {
    const { date } = req.params;
    const attendance = await Attendance.find({ 
        date: new Date(date) 
    }).populate('studentId', 'name');

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