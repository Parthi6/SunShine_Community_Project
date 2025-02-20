import express from 'express';
import { 
    adminLogin, 
    adminLogout, 
    getAdminDetails,
    getStudents,
    dashboardEvents,
    getAllEnrollments,
    getAllMessages,
    getGalleryImages
} from '../controllers/adminController.js';
import { isAuthenticatedAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Existing routes
router.post('/login', adminLogin);
router.get('/logout', adminLogout);
router.get('/me', isAuthenticatedAdmin, getAdminDetails);

// New dashboard routes
router.get('/students', isAuthenticatedAdmin, getStudents);
router.get('/enrollments', isAuthenticatedAdmin, getAllEnrollments);
router.get('/messages', isAuthenticatedAdmin, getAllMessages);
router.get('/gallery', isAuthenticatedAdmin, getGalleryImages);
router.get('/dashboard/events', isAuthenticatedAdmin, dashboardEvents);

export default router; 