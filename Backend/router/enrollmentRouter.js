// routes/enrollmentRouter.js
import express from "express";
import { 
    createEnrollment,
    getAllEnrollments,
    getEnrollmentById,
    updateEnrollment,
    deleteEnrollment
} from "../controllers/enrollmentController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Public route for parents to submit enrollment
router.post("/create", createEnrollment);

// Admin protected routes
router.get("/all", isAdminAuthenticated, getAllEnrollments);
router.get("/:id", isAdminAuthenticated, getEnrollmentById);
router.put("/:id", isAdminAuthenticated, updateEnrollment);
router.delete("/:id", isAdminAuthenticated, deleteEnrollment);

export default router;

//isParentAuthenticated,