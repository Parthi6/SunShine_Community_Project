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
    addNewAdmin,
    getAllUsers, 
    getSingleUser, 
    updateUserRole, 
    deleteUser 
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
router.get("/admin/users", isAdminAuthenticated, getAllUsers);
router.get("/admin/user/:id", isAdminAuthenticated, getSingleUser);
router.put("/admin/user/:id", isAdminAuthenticated, updateUserRole);
router.delete("/admin/user/:id", isAdminAuthenticated, deleteUser);

// Teacher routes
router.get("/teachers", getAllTeachers);
router.post("/teacher/addnew", isAdminAuthenticated, addNewTeacher);

export default router;