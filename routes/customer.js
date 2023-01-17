import express from "express";
import { getCustomers } from "../controllers/customer";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/customers", verifyToken, getCustomers);

export default router;
