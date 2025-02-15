import express from "express";
import { 
    register, 
    login, 
    logout, 
    getMyProfile,
    addNewTeacher, 
    getAllTeachers, 
    getUserDeatils, 
    logoutAdmin,
    addNewAdmin 
} from "../controllers/userController.js";
import { isAdminAuthenticated, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Parent routes
router.post("/parent/register", register);
router.post("/parent/login", login);
router.get("/parent/logout", logout);
router.get("/parent/me", isAuthenticated, getMyProfile);

// Admin routes
router.post("/admin/addnew", addNewAdmin);
router.get("/admin/me", isAdminAuthenticated, getUserDeatils);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

// Teacher routes
router.get("/teachers", getAllTeachers);
router.post("/teacher/addnew", isAdminAuthenticated, addNewTeacher);

export default router;