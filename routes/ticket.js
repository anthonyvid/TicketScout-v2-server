import express from "express";
import {
	createTicket,
	deleteTicket,
	deleteTickets,
	getTicketById,
	getTickets,
	getWeeklyTicketCount,
} from "../controllers/ticket.js";
import { verifyToken } from "../middleware/auth.js";
import { paginateResults } from "../middleware/paginate.js";

const router = express.Router();

router.get("/", verifyToken, paginateResults("tickets"), getTickets);
router.get(
	"/week-count",
	verifyToken,
	paginateResults("tickets"),
	getWeeklyTicketCount
);
router.post("/", verifyToken, createTicket);
router.get("/:id", verifyToken, getTicketById);
router.delete("/:id", verifyToken, deleteTicket);
router.delete("/", verifyToken, deleteTickets);

export default router;
