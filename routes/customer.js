import express from "express";
import {
	createCustomer,
	getCustomers,
	getCustomersById,
	getWeeklyCustomerCount,
} from "../controllers/customer.js";
import { verifyToken } from "../middleware/auth.js";
import { paginateResults } from "../middleware/paginate.js";

const router = express.Router();

router.get("/", verifyToken, paginateResults("customers"), getCustomers);
router.get(
	"/week-count",
	verifyToken,
	paginateResults("customers"),
	getWeeklyCustomerCount
);
router.post("/", verifyToken, createCustomer);
router.get("/:id", verifyToken, getCustomersById);

export default router;
