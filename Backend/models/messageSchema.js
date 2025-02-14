import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "First name must be at least 5 characters"],
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "Last name must be at least 5 characters"],
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    phone: {
        type: String,
        required: true,
        minLength: [10, "Provide a correct phone number"],
    },
    message: {
        type: String,
        required: true,
        minLength: [10, "Message must have at least 100 characters"],
    }
});

export const Message = mongoose.model("Message", messageSchema);
