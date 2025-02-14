import express from "express";
import { getAllMessage, sendMessage } from "../controller/messageController.js";
import {isAdminAuthenticated} from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", sendMessage);

router.get("/getmessage", isAdminAuthenticated , getAllMessage);

export default router;

