import { User } from "../models/userSchema.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

// Register a new user
export const register = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password
    });

    const token = user.generateToken();

    res.status(201).json({
        success: true,
        token,
        user
    });
});

// Login user
export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const token = user.generateToken();

    res.status(200).json({
        success: true,
        token,
        user
    });
});

// Logout user
export const logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

// Get user profile
export const getMyProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

// Add new teacher
export const addNewTeacher = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const teacher = await User.create({
        name,
        email,
        password,
        role: 'teacher'
    });

    res.status(201).json({
        success: true,
        teacher
    });
});

// Get all teachers
export const getAllTeachers = catchAsyncErrors(async (req, res, next) => {
    const teachers = await User.find({ role: 'teacher' });

    res.status(200).json({
        success: true,
        teachers
    });
});

// Get user details (Admin)
export const getUserDeatils = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

// Admin logout
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Admin logged out successfully"
    });
});

// Add new admin
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const admin = await User.create({
        name,
        email,
        password,
        role: 'admin'
    });

    res.status(201).json({
        success: true,
        admin
    });
});

// Get all users (Admin)
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    });
});

// Get single user (Admin)
export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user
    });
});

// Update user role (Admin)
export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user
    });
});

// Delete user (Admin)
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
}); 