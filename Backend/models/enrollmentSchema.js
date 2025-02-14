import mongoose from "mongoose";
import validator from "validator";

const enrollmentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    address: {
        type: String,
        required: [true, "Address Is Required!"],
        minLength: [3, "Address Must Contain At Least 3 Characters!"],
    },
    phone: {
        type: String,
        required: true,
        minLength: [10, "Provide a correct phone number"],
    },
   
    fatherName: {
        type: String,
        required: true,
        minLength: [3, "Father name must be at least 5 characters"],
    },
    fatherNic: {
        type: String,
        required: [true, "NIC Is Required!"],
        minLength: [10, "NIC Must Contain Only 10 Characters!"],
        maxLength: [10, "NIC Must Contain Only 10 Characters!"],
    },
    studentName: {
        type: String,
        required: true,
        minLength: [3, "Student name must be at least 5 characters"],
    },
    dob: {
        type: Date,
        required: [true, "DOB Is Required!"],
    },
    gender: {
        type: String,
        required: [true, "Gender Is Required!"],
        enum: ["Male", "Female"],
    },
    parentId: {
        type: mongoose.Schema.ObjectId,
        // required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Accepted"],  // Add 'Accepted' here
        default: "Pending",
    }
});

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
