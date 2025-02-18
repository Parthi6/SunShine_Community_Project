import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        trim: true
    },
    message: {
        type: String,
        required: [true, "Please enter your message"],
        trim: true
    },
    status: {
        type: String,
        enum: ["unread", "read"],
        default: "unread"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Message = mongoose.model("Message", messageSchema);
