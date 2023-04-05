import express from "express";
import {
	createOrganization,
	getOrganizationById,
	getOrganizations,
} from "../controllers/organization.js";
import { verifyToken } from "../middleware/auth.js";

import { validateStore, validateUser } from "../middleware/validate.js";

const router = express.Router();

router.post("/", validateUser, validateStore, createOrganization);
router.get("/", verifyToken, getOrganizations);
router.get("/:id", verifyToken, getOrganizationById);

export default router;
