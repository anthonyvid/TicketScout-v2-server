import express from "express";
import { getDashboard, getOrganization } from "../controllers/organization";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/dashboard", verifyToken, getDashboard);
router.get("", verifyToken, getOrganization);

export default router;
