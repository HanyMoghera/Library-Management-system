import { Router } from "express";
import { register, login, profile } from "./userService.js";
import { auth, loginLimiter } from "../../middleware/auth.js";

const router = Router();
router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/profile", auth, profile);

export default router;
