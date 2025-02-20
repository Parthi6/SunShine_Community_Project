import express from "express";
import { 
    markAttendance,
    getAttendanceByDate,
    getAttendanceByClass,
    getAttendanceAnalytics,
    updateAttendance,
    getAllAttendance,
    deleteAttendance,
    getWeeklyTrend,
    getClasswiseAttendance
} from "../controllers/attendanceController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Protect all routes
router.use(isAdminAuthenticated);

// Attendance routes
router.route("/mark")
    .post(markAttendance);

router.route("/by-date/:date")
    .get(getAttendanceByDate);

router.route("/by-class/:className")
    .get(getAttendanceByClass);

router.route("/analytics")
    .get(getAttendanceAnalytics);

router.route("/analytics/weekly")
    .get(getWeeklyTrend);

router.route("/analytics/classwise")
    .get(getClasswiseAttendance);

router.route("/:id")
    .put(updateAttendance)
    .delete(deleteAttendance);

router.route("/")
    .get(getAllAttendance);

export default router;