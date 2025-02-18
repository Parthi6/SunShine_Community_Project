import Student from '../models/studentModel.js';
import ErrorHandler from '../utils/errorHandler.js';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// Get all students
export const getAllStudents = catchAsyncErrors(async (req, res, next) => {
    const students = await Student.find().sort({ name: 1 });
    
    res.status(200).json({
        success: true,
        students
    });
});

// Get single student
export const getStudentById = catchAsyncErrors(async (req, res, next) => {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
        return next(new ErrorHandler('Student not found', 404));
    }
    
    res.status(200).json({
        success: true,
        student
    });
});

// Create new student
export const createStudent = catchAsyncErrors(async (req, res, next) => {
    try {
        const studentData = { ...req.body };

        // Parse medical info if it's a string
        if (typeof studentData.medicalInfo === 'string') {
            studentData.medicalInfo = JSON.parse(studentData.medicalInfo);
        }

        // Handle photo upload
        if (req.files && req.files.photo) {
            const result = await cloudinary.v2.uploader.upload(
                req.files.photo.tempFilePath,
                {
                    folder: 'students',
                    width: 250,
                    height: 250,
                    crop: 'fill',
                }
            );

            // Clean up temp file
            fs.unlinkSync(req.files.photo.tempFilePath);

            studentData.photo = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        } else {
            return next(new ErrorHandler('Please upload a student photo', 400));
        }

        const student = await Student.create(studentData);
        
        res.status(201).json({
            success: true,
            student
        });
    } catch (error) {
        // Clean up temp file if it exists
        if (req.files && req.files.photo) {
            fs.unlinkSync(req.files.photo.tempFilePath);
        }
        return next(error);
    }
});

// Update student
export const updateStudent = catchAsyncErrors(async (req, res, next) => {
    try {
        let student = await Student.findById(req.params.id);
        
        if (!student) {
            return next(new ErrorHandler('Student not found', 404));
        }

        // Handle photo upload if there's a new photo
        if (req.files && req.files.photo) {
            try {
                // Delete old photo from cloudinary if it exists
                if (student.photo && student.photo.public_id) {
                    await cloudinary.v2.uploader.destroy(student.photo.public_id);
                }

                const result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
                    folder: 'students',
                });

                // Clean up temp file
                fs.unlinkSync(req.files.photo.tempFilePath);

                req.body.photo = {
                    public_id: result.public_id,
                    url: result.secure_url,
                };
            } catch (error) {
                console.error('Cloudinary Error:', error);
                return next(new ErrorHandler('Error uploading image', 500));
            }
        }

        // Parse medical info if it's a string
        if (typeof req.body.medicalInfo === 'string') {
            try {
                req.body.medicalInfo = JSON.parse(req.body.medicalInfo);
            } catch (error) {
                console.error('JSON Parse Error:', error);
                return next(new ErrorHandler('Invalid medical info format', 400));
            }
        }

        student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        
        res.status(200).json({
            success: true,
            student
        });
    } catch (error) {
        // Clean up temp file if it exists
        if (req.files && req.files.photo) {
            fs.unlinkSync(req.files.photo.tempFilePath);
        }
        return next(error);
    }
});

// Delete student
export const deleteStudent = catchAsyncErrors(async (req, res, next) => {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
        return next(new ErrorHandler('Student not found', 404));
    }
    
    await student.deleteOne();
    
    res.status(200).json({
        success: true,
        message: 'Student deleted successfully'
    });
}); 