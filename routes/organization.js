import express from "express";
import { getDashboard, getOrganization } from "../controllers/organization.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", verifyToken, getDashboard);
router.get("", verifyToken, getOrganization);

export default router;
