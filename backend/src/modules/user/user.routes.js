import express from "express";
import { register, login, refreshToken, getCurrentUser, logout } from "./user.controller.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", verifyToken, getCurrentUser);

router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;