import express from "express";
import {
	createOrganization,
	getDashboard,
	getOrganizations,
	getOrganization,
} from "../controllers/organization.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", createOrganization);
router.get("/dashboard", verifyToken, getDashboard);
router.get("/organizations", getOrganizations);
router.post("/organization", getOrganization);

export default router;
