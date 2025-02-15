import { User } from "../models/userSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { USER_ROLES } from "../constants/userRoles.js";

// Parent Registration
export const register = catchAsyncError(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return next(new ErrorHandler("Please fill all required fields", 400));
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorHandler("Email already registered", 400));
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            role: USER_ROLES.PARENT // Default role for registration
        });

        // Generate token
        const token = user.generateToken();

        // Set cookie options
        const options = {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        // Send response
        res.status(201)
            .cookie("token", token, options)
            .json({
                success: true,
                message: "Registered successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

    } catch (error) {
        console.error("Registration error:", error);
        return next(new ErrorHandler(error.message, 500));
    }
});

// Login
export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const token = user.generateToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    res.status(200)
        .cookie("token", token, options)
        .json({
            success: true,
            message: `Welcome back, ${user.name}`,
            user,
        });
});

// Logout
export const logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

// Get User Profile
export const getMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user,
    });
});

// Admin Controllers
export const addNewAdmin = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please fill all required fields", 400));
    }

    const user = await User.create({
        name,
        email,
        password,
        role: USER_ROLES.ADMIN
    });

    res.status(201).json({
        success: true,
        message: "Admin created successfully",
        user
    });
});

// Teacher Controllers
export const addNewTeacher = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please fill all required fields", 400));
    }

    const user = await User.create({
        name,
        email,
        password,
        role: USER_ROLES.TEACHER
    });

    res.status(201).json({
        success: true,
        message: "Teacher added successfully",
        user
    });
});

export const getAllTeachers = catchAsyncError(async (req, res, next) => {
    const teachers = await User.find({ role: USER_ROLES.TEACHER });

    res.status(200).json({
        success: true,
        teachers
    });
});

// Get User Details
export const getUserDeatils = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user
    });
});

// Admin Logout
export const logoutAdmin = catchAsyncError(async (req, res, next) => {
    res.cookie("adminToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Admin logged out successfully"
    });
});

// Parent Logout
export const logoutParent = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
}); 