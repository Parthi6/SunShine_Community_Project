import express from 'express';
import { adminLogin, adminSignup, getAdminDetails, adminLogout } from '../controllers/adminController.js';
import { isAdminAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.get('/logout', adminLogout);
router.get('/dashboard', isAdminAuthenticated, getAdminDetails);

export default router; 