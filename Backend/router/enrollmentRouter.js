// routes/enrollmentRouter.js
import express from "express";
import { deleteEnrollment, enrollmentForm, getAllEnrollment, updateEnrollmentStatus } from "../controller/enrollmentController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Enrollment routes
router.post("/form",  enrollmentForm);
router.get("/getall",  getAllEnrollment);
router.put("/update/:id",  updateEnrollmentStatus);
router.delete("/delete/:id",  deleteEnrollment);

export default router;

//isParentAuthenticated,