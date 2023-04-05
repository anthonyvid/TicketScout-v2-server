import express from "express";
import { getTicketById, getTickets } from "../controllers/ticket.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getTickets);
router.get("/:id", verifyToken, getTicketById);

export default router;
