import express from "express";
import { addNewTeacher, getAllTeachers, getUserDeatils, logoutAdmin, logoutParent, parentRegister } from "../controller/userController.js";
import { login } from "../controller/userController.js";
import { addNewAdmin } from "../controller/userController.js";
import {isAdminAuthenticated} from "../middlewares/auth.js";

const router = express.Router();
router.post("/parent/register", parentRegister);
router.post("/login", login);
router.post("/admin/addnew", addNewAdmin);
router.get("/teachers", getAllTeachers);
router.get("/admin/me",isAdminAuthenticated, getUserDeatils);
router.get("/parent/me", getUserDeatils);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.get("/parent/logout",  logoutParent);
router.post("/teacher/addnew", isAdminAuthenticated, addNewTeacher);


export default router;
//isParentAuthenticated,