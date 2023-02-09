import express from "express";
import { resetPassword, uniqueEmail } from "../controllers/user.js";

const router = express.Router();

router.post("/checkUnique", uniqueEmail);
router.post("/reset-password", resetPassword);

export default router;
