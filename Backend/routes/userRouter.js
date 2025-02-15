import express from "express";
import { register, login, logout, getMyProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { registerValidator, validate } from "../middlewares/validator.js";

const router = express.Router();

router.route("/parent/register")
    .post(registerValidator, validate, register);

router.route("/parent/login").post(login);
router.route("/parent/logout").get(logout);
router.route("/parent/me").get(isAuthenticated, getMyProfile);

export default router; 