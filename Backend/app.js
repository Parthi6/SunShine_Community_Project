import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import errorMiddleware from "./middlewares/error.js";
import { dbConnection } from "./database/dbConnection.js";
import './config/cloudinary.js';

// Routes
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import enrollmentRouter from "./router/enrollmentRouter.js";
import attendanceRouter from "./router/attendanceRoutes.js";
import contactRoute from './routes/contactRoute.js';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
}));

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/enrollment", enrollmentRouter);
app.use('/api/v1/attendances', attendanceRouter);
app.use('/api/v1/contact', contactRoute);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/gallery', galleryRoutes);

app.use(errorMiddleware);

export default app;
