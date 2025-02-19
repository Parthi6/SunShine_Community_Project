import express from 'express';
import { createMessage, getAllMessages } from '../controllers/messageController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.post('/message/create', createMessage);
router.get('/messages', isAuthenticatedUser, authorizeRoles('admin'), getAllMessages);

export default router; 