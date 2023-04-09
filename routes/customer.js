import express from "express";
import {
	createCustomer,
	getCustomers,
	getCustomersById,
} from "../controllers/customer.js";
import { verifyToken } from "../middleware/auth.js";
import { paginateResults } from "../middleware/paginate.js";

const router = express.Router();

router.get("/", verifyToken, paginateResults("customers"), getCustomers);
router.post("/", verifyToken, createCustomer);
router.get("/:id", verifyToken, getCustomersById);

export default router;
