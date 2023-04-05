import express from "express";
import { getPaymentById, getPayments } from "../controllers/payment.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getPayments);
router.get("/:id", verifyToken, getPaymentById);

export default router;
