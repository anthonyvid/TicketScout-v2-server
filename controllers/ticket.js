import { statusCodes } from "../constants/statusCodes.constants.js";
import { db } from "../utils/db.js";
import { arrayToObject, throwError } from "../utils/helper.js";

export const getTickets = async (req, res, next) => {
	try {
		const cursor = await db.collection("tickets").find();
		if (!cursor) next(throwError(statusCodes.INTERNAL_ERROR));

		let tickets = await cursor.toArray();
		tickets = arrayToObject(tickets, "ticketId");
		res.status(statusCodes.OK).json({ tickets });
	} catch (error) {
		next(error);
	}
};

export const getTicketById = async (req, res, next) => {
	try {
		const ticket = await db
			.collection("tickets")
			.findOne({ ticketId: req.params.id });

		if (!ticket) {
			next(throwError(statusCodes.INTERNAL_ERROR));
		}

		res.status(statusCodes.OK).json({ ticket });
	} catch (error) {
		next(error);
	}
};
