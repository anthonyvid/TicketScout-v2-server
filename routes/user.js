import express from "express";
import { uniqueEmail } from "../controllers/user.js";

const router = express.Router();

router.post("/checkUnique", uniqueEmail);

export default router;
