import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js";
import cloudinary from "cloudinary";




export const parentRegister = catchAsyncErrors(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password
    } = req.body;

    // Validate all required fields
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password 
       

    ) {
        return next(new ErrorHandler("Please fill the full form", 400));
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return next(new ErrorHandler("User already Registered!", 400));
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        role: "Parent",
      });
      generateToken(user, "User Registered!", 200, res);

});

//User login
export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }
  
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }
    if (role !== user.role) {
      return next(new ErrorHandler(`User Not Found With This Role!`, 400));
    }
    generateToken(user, "Login Successfully!", 201, res);
  });


//Admin login
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password } =
      req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password 
      
    ) {
      return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
  
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
    }
  
    const admin = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: "Admin",
    });
    res.status(200).json({
      success: true,
      message: "New Admin Registered",
      admin,
    });
  });


//Student Details get from Parent Account
export const getAllTeachers = catchAsyncErrors(async (req, res, next) => {
  const students = await User.find({role: "Teacher"});
  res.status(200).json({
    success: true,
    students,

  });

});


//getUserDeatils
export const getUserDeatils = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
});

//Admin Logout
export const logoutAdmin = catchAsyncErrors(async (req, res, next)=>{
  res
  .status(200)
  .cookie("adminToken", "",{
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  .json({
    success: true,
    message: "Logout Successfully!"
  })
})

//Parent Logout
export const logoutParent = catchAsyncErrors(async (req, res, next)=>{
  res
  .status(200)
  .cookie("parentToken", "",{
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  .json({
    success: true,
    message: "Logout Successfully!"
  })
});


// Add New Teacher
// Add New Teacher
export const addNewTeacher = catchAsyncErrors(async (req, res, next) => {
  // Check if file is uploaded
  // if (!req.files || Object.keys(req.files).length === 0) {
  //   return next(new ErrorHandler("Teacher Profile Image Required!", 400));
  // }

  // const { tecProfile } = req.files;  // Access the uploaded file

  // // Check file type (valid image formats)
  // const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  // if (!allowedFormats.includes(tecProfile.mimetype)) {
  //   return next(new ErrorHandler("File Format Not Supported! Only PNG, JPEG, and WebP are allowed.", 400));
  // }

  // Get teacher details from the request body
  const { firstName, lastName, email, phone, nic, address, password } = req.body;

  // Ensure all required fields are provided
  if (!firstName || !lastName || !email || !phone || !nic || !address || !password ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  // Check if a teacher with the same email already exists
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Teacher With This Email Already Exists!", 400));
  }

  // Upload the profile image to Cloudinary (using file buffer directly)
  // const cloudinaryResponse = await cloudinary.uploader.upload(
  //   tecProfile.tempFilePath || tecProfile.data,  // Using file buffer (or tempFilePath if needed)
  //   {
  //     folder: "teachers/profiles",  // Folder in Cloudinary to store the images
  //     resource_type: "auto",  // Automatically detect file type (image, video, etc.)
  //     public_id: `teacher_${Date.now()}`,  // Use a unique public_id for the uploaded image (optional)
  //   }
  // );

  // Handle Cloudinary errors if upload fails
  // if (!cloudinaryResponse || cloudinaryResponse.error) {
  //   console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
  //   return next(new ErrorHandler("Failed To Upload Teacher Profile To Cloudinary", 500));
  // }

  // Create a new teacher record in the database
  const teacher = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    address,
    password,
    role: "Teacher",
    // tecProfile: {
    //   public_id: cloudinaryResponse.public_id,
    //   url: cloudinaryResponse.secure_url,  // Store the Cloudinary URL for the profile image
    // },
  });

  // Send response to client
  res.status(200).json({
    success: true,
    message: "New Teacher Registered",
    teacher,
  });
});