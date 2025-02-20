import Gallery from '../models/galleryModel.js';
import ErrorHandler from '../utils/errorHandler.js';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import cloudinary from 'cloudinary';

// Create new album
export const createAlbum = catchAsyncErrors(async (req, res, next) => {
    try {
        const { title, description, category } = req.body;
        
        const album = await Gallery.create({
            title,
            description,
            category,
            photos: []
        });

        res.status(201).json({
            success: true,
            album
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Upload photos to album
export const uploadPhotos = catchAsyncErrors(async (req, res, next) => {
    try {
        const album = await Gallery.findById(req.params.id);
        if (!album) {
            return next(new ErrorHandler('Album not found', 404));
        }

        if (!req.files || !req.files.photos) {
            return next(new ErrorHandler('Please upload at least one photo', 400));
        }

        // Ensure photos is always an array
        const photos = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];

        const uploadPromises = photos.map(async (file) => {
            const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: 'gallery',
                width: 1920,
                crop: "limit"
            });
            
            return {
                url: result.secure_url,
                width: result.width,
                height: result.height
            };
        });

        const uploadedPhotos = await Promise.all(uploadPromises);
        album.photos.push(...uploadedPhotos);
        await album.save();

        res.status(200).json({
            success: true,
            album
        });
    } catch (error) {
        console.error('Upload error:', error);
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get all albums
export const getAllAlbums = catchAsyncErrors(async (req, res, next) => {
    try {
        const albums = await Gallery.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            albums
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get album by ID
export const getAlbumById = catchAsyncErrors(async (req, res, next) => {
    try {
        const album = await Gallery.findById(req.params.id);
        
        if (!album) {
            return next(new ErrorHandler('Album not found', 404));
        }
        
        res.status(200).json({
            success: true,
            album
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete album
export const deleteAlbum = catchAsyncErrors(async (req, res, next) => {
    try {
        const album = await Gallery.findById(req.params.id);
        
        if (!album) {
            return next(new ErrorHandler('Album not found', 404));
        }

        // Delete photos from cloudinary
        const deletePromises = album.photos.map(photo => 
            cloudinary.v2.uploader.destroy(photo.url.split('/').pop().split('.')[0])
        );
        
        await Promise.all(deletePromises);
        await album.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Album deleted successfully'
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Add this new controller function
export const deletePhotos = catchAsyncErrors(async (req, res, next) => {
    try {
        const album = await Gallery.findById(req.params.id);
        if (!album) {
            return next(new ErrorHandler('Album not found', 404));
        }

        const { photoIds } = req.body;

        // Delete photos from cloudinary
        const deletePromises = photoIds.map(photoId => {
            const photo = album.photos.find(p => p._id.toString() === photoId);
            if (photo) {
                // Extract public_id from the URL
                const publicId = photo.url.split('/').slice(-1)[0].split('.')[0];
                return cloudinary.v2.uploader.destroy(`gallery/${publicId}`);
            }
        });

        await Promise.all(deletePromises);

        // Remove photos from album
        album.photos = album.photos.filter(
            photo => !photoIds.includes(photo._id.toString())
        );
        await album.save();

        res.status(200).json({
            success: true,
            message: 'Photos deleted successfully',
            album
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}); 