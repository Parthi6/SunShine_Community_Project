import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Student ID is required"]
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
        default: Date.now
    },
    status: {
        type: String,
        required: [true, "Status is required"],
        enum: ["Present", "Absent", "Late"],
        default: "Present"
    },
    remarks: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to prevent duplicate attendance records
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);