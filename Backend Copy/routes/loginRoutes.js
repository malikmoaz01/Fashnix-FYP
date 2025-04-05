import express from "express";
import { loginUser, googleLogin } from "../controllers/loginController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/google-login", googleLogin);

export default router;