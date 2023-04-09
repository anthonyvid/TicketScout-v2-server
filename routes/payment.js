import express from "express";
import { getPaymentById, getPayments } from "../controllers/payment.js";
import { verifyToken } from "../middleware/auth.js";
import { paginateResults } from "../middleware/paginate.js";

const router = express.Router();

router.get("/", verifyToken, paginateResults("payments"), getPayments);
router.get("/:id", verifyToken, getPaymentById);

export default router;
