import { statusCodes } from "../constants/server.constants.js";
import Ticket from "../models/Ticket.js";
import { ObjectId } from "../utils/db.js";
import { getWeeklyDataCount, throwError } from "../utils/helper.js";

export const getTickets = async (req, res, next) => {
	try {
		res.json(res.paginatedResults);
	} catch (error) {
		next(error);
	}
};

export const createTicket = async (req, res, next) => {
	try {
		const { title, description, customerId, userId } = req.body;
		const organizationId = req.headers.organizationid;

		const newTicket = new Ticket({
			title,
			description,
			customer: ObjectId(customerId),
			createdBy: ObjectId(userId),
			organizationId: ObjectId(organizationId),
		});
		const ticket = await newTicket.save();

		if (!ticket) return next(throwError(statusCodes.INTERNAL_ERROR));

		res.status(statusCodes.CREATED).json({ ticket });
	} catch (error) {
		next(error);
	}
};

export const getTicketById = async (req, res, next) => {
	try {
		const ticket = await Ticket.findOne({ ticketId: req.params.id });

		if (!ticket) {
			return next(throwError(statusCodes.INTERNAL_ERROR));
		}

		res.status(statusCodes.OK).json({ ticket });
	} catch (error) {
		next(error);
	}
};

export const getWeeklyTicketCount = async (req, res, next) => {
	try {
		const data = res.paginatedResults;
		data.results = getWeeklyDataCount(data.results);
		res.status(statusCodes.OK).json(data);
	} catch (error) {
		next(error);
	}
};
