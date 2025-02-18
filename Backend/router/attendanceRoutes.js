import express from "express";
import { 
    markAttendance,
    getAttendanceByDate,
    getAttendanceByStudent,
    updateAttendance,
    deleteAttendance,
    getAllAttendance
} from "../controllers/attendanceController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Admin routes
router.post("/mark", isAdminAuthenticated, markAttendance);
router.get("/all", isAdminAuthenticated, getAllAttendance);
router.get("/date/:date", isAdminAuthenticated, getAttendanceByDate);
router.get("/student/:studentId", isAdminAuthenticated, getAttendanceByStudent);
router.put("/:id", isAdminAuthenticated, updateAttendance);
router.delete("/:id", isAdminAuthenticated, deleteAttendance);

export default router;