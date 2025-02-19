import Message from '../models/messageModel.js';
import ErrorHandler from '../utils/errorHandler.js';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import sendEmail from '../utils/sendEmail.js';

// Create new message
export const createMessage = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, phone, message } = req.body;

        // Save message to database
        const newMessage = await Message.create({
            name,
            email,
            phone,
            message,
            status: 'unread'
        });

        // Send email notifications (both admin notification and auto-reply)
        await sendEmail({
            name,
            email,
            phone,
            message
        });

        res.status(201).json({
            success: true,
            message: "Message sent successfully!",
            data: newMessage
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get all messages (admin only)
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        messages
    });
});

// Update message status
export const updateMessageStatus = catchAsyncErrors(async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);
        
        if (!message) {
            return next(new ErrorHandler('Message not found', 404));
        }
        
        message.status = req.body.status; // 'read' or 'unread'
        await message.save();
        
        res.status(200).json({
            success: true,
            message: 'Message status updated successfully'
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete message
export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);
        
        if (!message) {
            return next(new ErrorHandler('Message not found', 404));
        }
        
        await message.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});