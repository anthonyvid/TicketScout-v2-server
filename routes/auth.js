import express from "express";
import { login, register } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", register);
router.post("/register", register);

export default router;
