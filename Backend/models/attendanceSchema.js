import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment', // Linking to the Enrollment collection
      required: true,
    },
    date: {
      type: String, // Storing date as string (e.g., "Thu Oct 05 2023")
      required: true,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent'], // Possible statuses
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Export the Attendance model as the default export
const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;