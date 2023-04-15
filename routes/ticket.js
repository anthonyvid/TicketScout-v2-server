import express from "express";
import {
	createTicket,
	getTicketById,
	getTickets,
    getWeeklyTicketCount,
} from "../controllers/ticket.js";
import { verifyToken } from "../middleware/auth.js";
import { paginateResults } from "../middleware/paginate.js";

const router = express.Router();

router.get("/", verifyToken, paginateResults("tickets"), getTickets);
router.get("/week-count", verifyToken, paginateResults("tickets"), getWeeklyTicketCount);
router.post("/", verifyToken, createTicket);
router.get("/:id", verifyToken, getTicketById);

export default router;
