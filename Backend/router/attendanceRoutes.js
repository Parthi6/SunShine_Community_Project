import express from 'express';
import { markAttendance } from '../controller/attendanceController.js';
import { isAdminAuthenticated } from '../middlewares/auth.js'; // Assuming only admins can mark attendance

const router = express.Router();

// Mark attendance route (POST method)
router.post("/mark", isAdminAuthenticated, markAttendance);

export default router;