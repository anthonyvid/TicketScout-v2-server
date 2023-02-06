import express from "express";
import { createStore, getDashboard, getStore } from "../controllers/store.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", createStore);
router.get("/dashboard", verifyToken, getDashboard);
router.get("", verifyToken, getStore);

export default router;
