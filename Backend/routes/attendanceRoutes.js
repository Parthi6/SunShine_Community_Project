import express from 'express';
import { 
    markAttendance,
    getAttendanceByDate,
    getAttendanceByClass,
    getAttendanceAnalytics,
    updateAttendance
} from '../controllers/attendanceController.js';
import { isAdminAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.use(isAdminAuthenticated);

router.post('/mark', markAttendance);
router.get('/by-date/:date', getAttendanceByDate);
router.get('/by-class/:className', getAttendanceByClass);
router.get('/analytics', getAttendanceAnalytics);
router.put('/update/:id', updateAttendance);

export default router; 