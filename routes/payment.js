import express from "express";
import { getPaymentById, getPayments, getWeeklyPaymentCount } from "../controllers/payment.js";
import { verifyToken } from "../middleware/auth.js";
import { paginateResults } from "../middleware/paginate.js";

const router = express.Router();

router.get("/", verifyToken, paginateResults("payments"), getPayments);
router.get("/week-count", verifyToken, paginateResults("payments"), getWeeklyPaymentCount);
router.get("/:id", verifyToken, getPaymentById);

export default router;
