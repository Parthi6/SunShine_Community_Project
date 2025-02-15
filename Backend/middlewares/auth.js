import { User } from "../models/userSchema.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";

// Admin Authentication
export const isAdminAuthenticated = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.adminToken;  // Check for adminToken in the cookies
    if (!token) {
        return next(new ErrorHandler("Admin is not Authenticated!", 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);  // Verify the JWT token
    req.user = await User.findById(decoded.id);  // Retrieve user from DB
    if (req.user.role !== "Admin") {
        return next(new ErrorHandler(`${req.user.role} is not Authenticated!`, 400));
    }

    next();
});

// Patient Authentication (for Parent role)
// export const isParentAuthenticated = catchAsyncError(async (req, res, next) => {
//     const token = req.cookies.parentToken; // Using 'parentToken' for parents
//     if (!token) {
//         return next(new ErrorHandler("Parent is not Authenticated!", 400)); // Correct message for Parent
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     req.user = await User.findById(decoded.id);
//     if (req.user.role !== "Parent") {
//         return next(new ErrorHandler(`${req.user.role} is not Authenticated!`, 400)); // Ensure 'Parent' is used
//     }
//     next();
// });

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
});

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    };
};