import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
    parentName: {
        type: String,
        required: [true, 'Please enter parent name']
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Please enter phone number']
    },
    nic: {
        type: String,
        required: [true, 'Please enter NIC']
    },
    address: {
        type: String,
        required: [true, 'Please enter address']
    },
    studentName: {
        type: String,
        required: [true, 'Please enter student name']
    },
    dob: {
        type: Date,
        required: [true, 'Please enter date of birth']
    },
    gender: {
        type: String,
        required: [true, 'Please select gender'],
        enum: ['Male', 'Female']
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    additionalNotes: {
        type: String,
        default: ''
    }
});

export default mongoose.model('Enrollment', enrollmentSchema); 