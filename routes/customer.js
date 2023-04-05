import express from "express";
import { getCustomers, getCustomersById } from "../controllers/customer.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getCustomers);
router.get("/:id", verifyToken, getCustomersById);

export default router;
