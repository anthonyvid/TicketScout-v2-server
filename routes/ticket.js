import express from "express";
import { getTickets } from "../controllers/ticket.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/tickets", verifyToken, getTickets);

export default router;
