import { Enrollment } from "../models/enrollmentSchema.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

// Create new enrollment
export const createEnrollment = catchAsyncErrors(async (req, res, next) => {
    const enrollment = await Enrollment.create(req.body);

    res.status(201).json({
        success: true,
        enrollment
    });
});

// Get all enrollments - Admin
export const getAllEnrollments = catchAsyncErrors(async (req, res, next) => {
    const enrollments = await Enrollment.find();

    res.status(200).json({
        success: true,
        enrollments
    });
});

// Get single enrollment - Admin
export const getEnrollmentById = catchAsyncErrors(async (req, res, next) => {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
        return next(new ErrorHandler("Enrollment not found", 404));
    }

    res.status(200).json({
        success: true,
        enrollment
    });
});

// Update enrollment status - Admin
export const updateEnrollment = catchAsyncErrors(async (req, res, next) => {
    let enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
        return next(new ErrorHandler("Enrollment not found", 404));
    }

    enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        enrollment
    });
});

// Delete enrollment - Admin
export const deleteEnrollment = catchAsyncErrors(async (req, res, next) => {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
        return next(new ErrorHandler("Enrollment not found", 404));
    }

    await enrollment.deleteOne();

    res.status(200).json({
        success: true,
        message: "Enrollment deleted successfully"
    });
});