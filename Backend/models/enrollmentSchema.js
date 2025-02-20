import mongoose from "mongoose";
import validator from "validator";

const enrollmentSchema = new mongoose.Schema({
    childName: {
        type: String,
        required: [true, "Please enter child's name"],
        trim: true
    },
    age: {
        type: Number,
        required: [true, "Please enter child's age"]
    },
    parentName: {
        type: String,
        required: [true, "Please enter parent's name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter email address"],
        trim: true
    },
    phone: {
        type: String,
        required: [true, "Please enter phone number"]
    },
    program: {
        type: String,
        required: [true, "Please select a program"],
        enum: ["Toddler", "PreSchool", "Kindergarten"]
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Approved", "Rejected"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
