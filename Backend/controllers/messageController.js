import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

// Create a new message
export const createMessage = catchAsyncErrors(async (req, res, next) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    const newMessage = await Message.create({
        name,
        email,
        message
    });

    res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: newMessage
    });
});

// Get all messages (Admin only)
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        messages
    });
});

// Update message status
export const updateMessage = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const message = await Message.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );

    if (!message) {
        return next(new ErrorHandler("Message not found", 404));
    }

    res.status(200).json({
        success: true,
        message
    });
});

// Delete message
export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const message = await Message.findById(id);

    if (!message) {
        return next(new ErrorHandler("Message not found", 404));
    }

    await message.deleteOne();

    res.status(200).json({
        success: true,
        message: "Message deleted successfully"
    });
});