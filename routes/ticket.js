import express from "express";
import { getTickets } from "../controllers/ticket";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/tickets", verifyToken, getTickets);

export default router;
