import mongoose from 'mongoose';
import config from './config/config.js';

mongoose.connect(config.MONGODB_URI)
    .then(async () => {
        try {
            await mongoose.connection.collection('attendances').dropIndexes();
            console.log('Successfully dropped indexes');
        } catch (error) {
            console.log('Error dropping indexes:', error);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.log('Connection error:', err)); 