import express from "express";
import { login, register, verifySignUpCode } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/register/verifySignUpCode", verifySignUpCode);

export default router;
