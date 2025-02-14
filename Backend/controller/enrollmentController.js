import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Enrollment } from '../models/enrollmentSchema.js';

// Enrollment Form Submission
export const enrollmentForm = catchAsyncErrors(async (req, res, next) => {
    const {
        email,
        address,
        phone,
        fatherName,
        fatherNic,
        studentName,
        dob,
        gender
    } = req.body;

    if (
        !email ||
        !address ||
        !phone ||
        !fatherName ||
        !fatherNic ||
        !studentName ||
        !dob ||
        !gender
    ) {
        return next(new ErrorHandler("Please fill full form", 400));
    }

    await Enrollment.create({
        email,
        address,
        phone,
        fatherName,
        fatherNic,
        studentName,
        dob,
        gender
    });

    res.status(200).json({
        success: true,
        message: "Enrollment Registered Successfully!",
    });
});

// Get All Enrollments
export const getAllEnrollment = catchAsyncErrors(async (req, res, next) => {
    const enrollment = await Enrollment.find();
    res.status(200).json({
        success: true,
        enrollment,
    });
});

// Delete Enrollment
export const deleteEnrollment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let enrollment = await Enrollment.findById(id);
    if (!enrollment) {
        return next(new ErrorHandler("Enrollment is not found", 404));
    }
    await enrollment.deleteOne();
    res.status(200).json({
        success: true,
        message: "Enrollment Deleted Successfully!",
    });
});

// Update Enrollment Status (with the fix for "Accepted" status)
export const updateEnrollmentStatus = catchAsyncErrors(async (req, res, next) => {
    const enrollmentId = req.params.id;
    const status = req.body.status;

    // Check if the status is valid (including 'Accepted')
    if (!['Pending', 'Approved', 'Rejected', 'Accepted'].includes(status)) {
        return next(new ErrorHandler('Invalid status value', 400));
    }

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
        enrollmentId,
        { status },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: 'Enrollment status updated successfully',
        updatedEnrollment,
    });
});