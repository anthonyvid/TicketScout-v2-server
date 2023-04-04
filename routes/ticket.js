import express from "express";
import { getTickets } from "../controllers/ticket.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getTickets);

export default router;
