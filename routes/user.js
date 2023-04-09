import express from "express";
import { resetPassword, getUsers } from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";
import { paginateResults } from "../middleware/paginate.js";

const router = express.Router();

router.get("/", verifyToken, paginateResults("users"), getUsers);
router.post("/reset-password", resetPassword);

export default router;
