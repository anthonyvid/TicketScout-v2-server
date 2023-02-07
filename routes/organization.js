import express from "express";
import {
	createOrganization,
	getDashboard,
	getOrganizations,
	getOrganization,
	isUniqueStoreName,
} from "../controllers/organization.js";
import { verifyToken } from "../middleware/auth.js";
import { validateStore } from "../middleware/validate.js";

const router = express.Router();

router.post("/", validateStore, createOrganization);
router.post("/checkUnique", isUniqueStoreName);

router.get("/dashboard", verifyToken, getDashboard);
router.get("/organizations", getOrganizations);

export default router;
