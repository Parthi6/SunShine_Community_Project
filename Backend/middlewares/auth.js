import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import Admin from '../models/adminModel.js';
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";

// Check if user is authenticated
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid token", 401));
    }
});

// Authenticate admin
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
    // Check both cookie and Authorization header for the token
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decodedData.id);

        if (!admin || admin.role !== 'admin') {
            return next(new ErrorHandler("Only admins can access this resource", 403));
        }

        req.admin = admin;
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token", 401));
    }
});

// Authorize roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403));
        }
        next();
    };
};