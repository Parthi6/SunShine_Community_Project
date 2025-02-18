import Admin from '../models/adminModel.js';
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

// Register Admin
export const adminSignup = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return next(new ErrorHandler("Admin already exists with this email", 400));
    }

    const admin = await Admin.create({
        name,
        email,
        password,
        role: "admin"
    });

    // Generate token
    const token = admin.getJWTToken();

    // Options for cookie
    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true
    };

    // Remove password from response
    admin.password = undefined;

    res.status(201)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            admin
        });
});

// Login Admin
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Login attempt with:', { email, password });

        // First check if we can find the admin without password
        const adminExists = await Admin.findOne({ email });
        console.log('Admin exists (without password):', adminExists);

        // Then try to find with password
        const admin = await Admin.findOne({ email }).select('+password');
        console.log('Admin with password:', admin);

        if (!admin) {
            console.log('No admin found with this email');
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        console.log('Comparing passwords...');
        const isPasswordMatched = await admin.comparePassword(password);
        console.log('Password match result:', isPasswordMatched);

        if (!isPasswordMatched) {
            console.log('Password did not match');
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = admin.getJWTToken();
        console.log('Token generated:', token);

        const options = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res.status(200).cookie("token", token, options).json({
            success: true,
            admin,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Admin Details
export const getAdminDetails = catchAsyncErrors(async (req, res, next) => {
    const admin = await Admin.findById(req.admin.id);

    res.status(200).json({
        success: true,
        admin
    });
});

// Logout Admin
export const adminLogout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
}); 