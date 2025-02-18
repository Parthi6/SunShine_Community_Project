import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late'],
        required: true
    },
    class: {
        type: String,
        required: true
    },
    remarks: String
}, {
    timestamps: true
});

// Remove all existing indexes first
attendanceSchema.indexes().forEach(index => {
    attendanceSchema.index(index[0], { background: true });
});

// Add a new non-unique index
attendanceSchema.index({ student: 1, date: 1 }, { background: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

// Drop existing indexes and recreate
Attendance.collection.dropIndexes().catch(err => console.log('No indexes to drop'));

export default Attendance; 