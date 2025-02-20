import Enrollment from '../models/enrollmentModel.js';
import ErrorHandler from '../utils/errorHandler.js';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import sendEnrollmentEmail from '../utils/sendEnrollmentEmail.js';

// Create new enrollment
export const createEnrollment = catchAsyncErrors(async (req, res, next) => {
    try {
        const enrollment = await Enrollment.create(req.body);

        // Send enrollment confirmation emails
        await sendEnrollmentEmail({
            parentName: enrollment.parentName,
            email: enrollment.email,
            phone: enrollment.phone,
            address: enrollment.address,
            childName: enrollment.childName,
            dateOfBirth: enrollment.dateOfBirth,
            gender: enrollment.gender,
            class: enrollment.class,
            additionalInfo: enrollment.additionalInfo
        });

        res.status(201).json({
            success: true,
            message: "Enrollment application submitted successfully!",
            data: enrollment
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get all enrollments (admin)
export const getAllEnrollments = catchAsyncErrors(async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            enrollments
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Update enrollment status
export const updateEnrollmentStatus = catchAsyncErrors(async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);
        
        if (!enrollment) {
            return next(new ErrorHandler('Enrollment not found', 404));
        }
        
        enrollment.status = req.body.status;
        await enrollment.save();

        // Send email notification for approval
        if (req.body.status === 'approved') {
            await sendEnrollmentEmail({
                status: 'approved',
                parentName: enrollment.parentName,
                email: enrollment.email,
                childName: enrollment.childName,
                phone: enrollment.phone,
                address: enrollment.address,
                dateOfBirth: enrollment.dateOfBirth,
                gender: enrollment.gender,
                class: enrollment.class
            });
        }

        res.status(200).json({
            success: true,
            message: `Enrollment ${req.body.status} successfully`
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete enrollment
export const deleteEnrollment = catchAsyncErrors(async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);
        
        if (!enrollment) {
            return next(new ErrorHandler('Enrollment not found', 404));
        }
        
        await enrollment.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Enrollment deleted successfully'
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get enrollment by ID
export const getEnrollmentById = catchAsyncErrors(async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);
        
        if (!enrollment) {
            return next(new ErrorHandler('Enrollment not found', 404));
        }
        
        res.status(200).json({
            success: true,
            enrollment
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});