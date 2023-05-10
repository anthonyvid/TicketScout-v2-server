import express from "express";

import { verifyToken } from "../middleware/auth.js";
import { statusCodes } from "../constants/server.constants.js";
import Ticket from "../models/Ticket.js";
import Customer from "../models/Customer.js";

const router = express.Router();

router.get("/:value", verifyToken, async (req, res, next) => {
	try {
		const { value } = req.params;
		const { getTickets, getPayments, getCustomers } = req.query;

		let tickets = [],
			customers = [],
			payments = [];

		const regex = new RegExp(value, "i"); // i flag makes the search case-insensitive

		if (getTickets) {
			tickets = await Ticket.aggregate([
				{
					$addFields: {
						ticketIdString: { $toString: "$ticketId" },
					},
				},
				{
					$match: { ticketIdString: { $regex: regex } },
				},
				{
					$sort: { created_at: -1 },
				},
				{
					$limit: 25,
				},
				{
					$lookup: {
						from: "customers",
						localField: "customer",
						foreignField: "_id",
						as: "customer",
					},
				},
				{
					$unwind: "$customer",
				},
			]);
		}

		if (getCustomers) {
			customers = await Customer.find({
				$or: [
					{ firstname: { $regex: regex } },
					{ lastname: { $regex: regex } },
					{ fullname: { $regex: regex } },
					{ phone: { $regex: regex } },
				],
			})
				.sort({ created_at: -1 })
				.limit(25);
		}

		if (getPayments) {
		}

		res.status(statusCodes.OK).json({ tickets, customers, payments });
	} catch (error) {
		next(error);
	}
});

export default router;
