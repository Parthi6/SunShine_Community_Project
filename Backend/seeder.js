import mongoose from 'mongoose';
import { config } from "dotenv";
import Admin from './models/adminModel.js';
import { dbConnection } from "./database/dbConnection.js";

config({ path: "./config/config.env" });

const createInitialAdmin = async () => {
    try {
        await dbConnection();
        
        // Add debugging
        console.log('Connected to database');
        
        // Check if admin exists
        const adminExists = await Admin.findOne({ email: "admin@sunshine.com" });
        
        // Add debugging
        console.log('Existing admin:', adminExists);
        
        if (!adminExists) {
            const admin = await Admin.create({
                name: "Admin",
                email: "admin@sunshine.com",
                password: "admin123",
                role: "admin"
            });
            console.log('Initial admin created successfully:', admin);
        } else {
            console.log('Admin already exists');
        }
        
        // Verify the admin was created/exists
        const verifyAdmin = await Admin.findOne({ email: "admin@sunshine.com" });
        console.log('Verification - Admin in database:', verifyAdmin);
        
        console.log('Database operation completed');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

// Remove other code and just keep the admin creation
createInitialAdmin(); 