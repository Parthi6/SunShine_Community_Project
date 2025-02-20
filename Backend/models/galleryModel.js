import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter album title'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Events', 'Activities', 'Celebrations', 'Field Trips', 'Other']
    },
    photos: [{
        url: String,
        width: Number,
        height: Number
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Gallery', gallerySchema); 