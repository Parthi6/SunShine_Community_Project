import Attendance from '../models/attendanceSchema.js';
import { Enrollment } from '../models/enrollmentSchema.js';

// Mark Attendance
export const markAttendance = async (req, res) => {
    try {
        const { attendance } = req.body; // { studentId: "Present/Absent", studentId2: "Present/Absent", ... }

        // Loop through all student attendance
        for (let studentId in attendance) {
            // Check if the student exists and is accepted
            const student = await Enrollment.findById(studentId);
            if (!student || student.status !== 'Approved') { // Ensure the status is "Approved"
                return res.status(400).json({ message: `Student with ID ${studentId} is not approved.` });
            }

            // Create or update the attendance record for today
            await Attendance.findOneAndUpdate(
                { studentId: studentId, date: new Date().toDateString() }, // Ensure attendance is for today
                { status: attendance[studentId] },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({ message: "Attendance successfully marked!" });
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ message: "Failed to mark attendance" });
    }
};