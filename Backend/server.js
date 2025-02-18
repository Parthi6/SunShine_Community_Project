import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import app from './app.js';
import cloudinary from 'cloudinary';
import { dbConnection } from './database/dbConnection.js';

// Get the directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars first - with absolute path
config({ path: join(__dirname, 'config', 'config.env') });

// Verify env vars are loaded
console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI ? 'Defined' : 'Undefined'
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const startServer = async () => {
    try {
        await dbConnection(); // Connect to MongoDB first
        
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

