import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        
        const { connection } = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to Database: ${connection.host}`);
    } catch (error) {
        console.error('Database Connection Error:', error);
        process.exit(1);
    }
};

//mongodb+srv://vpartheepan:school@cluster0.fwli1.mongodb.net/?retryWrites=true