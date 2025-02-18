import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter student name"],
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Please enter date of birth"]
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    photo: {
        public_id: String,
        url: {
            type: String,
            default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
        }
    },
    parentName: {
        type: String,
        required: [true, "Please enter parent name"]
    },
    parentEmail: {
        type: String,
        required: [true, "Please enter parent email"]
    },
    parentPhone: {
        type: String,
        required: [true, "Please enter parent phone number"]
    },
    address: {
        type: String,
        required: [true, "Please enter address"]
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    class: {
        type: String,
        required: [true, "Please select class"],
        enum: ['Toddler', 'PreK-1', 'PreK-2', 'Kindergarten']
    },
    attendance: [{
        date: Date,
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late']
        }
    }],
    medicalInfo: {
        allergies: [String],
        medications: [String],
        specialNeeds: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Graduated'],
        default: 'Active'
    }
}, {
    timestamps: true
});

export default mongoose.model('Student', studentSchema); 