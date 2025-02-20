import express from 'express';
import { 
    createEnrollment, 
    getAllEnrollments, 
    getEnrollmentById,
    updateEnrollmentStatus,
    deleteEnrollment 
} from '../controllers/enrollmentController.js';
import { isAdminAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/create', createEnrollment);

// Admin routes
router.get('/all', isAdminAuthenticated, getAllEnrollments);
router.get('/:id', isAdminAuthenticated, getEnrollmentById);
router.put('/:id', isAdminAuthenticated, updateEnrollmentStatus);
router.delete('/:id', isAdminAuthenticated, deleteEnrollment);

export default router; 