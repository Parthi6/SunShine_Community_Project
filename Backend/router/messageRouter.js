import express from "express";
import { 
    createMessage, 
    getAllMessages, 
    updateMessageStatus,
    deleteMessage 
} from "../controllers/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Public route
router.post("/create", createMessage);

// Admin routes
router.get("/all", isAdminAuthenticated, getAllMessages);
router.put("/:id", isAdminAuthenticated, updateMessageStatus);
router.delete("/:id", isAdminAuthenticated, deleteMessage);

export default router;

