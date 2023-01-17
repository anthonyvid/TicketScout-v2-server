import express from "express";
import { getCustomers } from "../controllers/customer.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/customers", verifyToken, getCustomers);

export default router;
