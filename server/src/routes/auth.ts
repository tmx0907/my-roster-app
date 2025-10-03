import { Router } from "express";
import { login, register, refreshToken, logout, me } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", me);

export default router;
