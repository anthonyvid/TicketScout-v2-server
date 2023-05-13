import { statusCodes } from "../constants/server.constants.js";
import Ticket from "../models/Ticket.js";
import { io } from "../socket.js";
import { ObjectId, db } from "../utils/db.js";
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
		const { title, description, status, customerId, createdBy } = req.body;
		const organizationId = req.headers.organizationid;

		const newTicket = new Ticket({
			title,
			description,
			status,
			customer: ObjectId(customerId),
			createdBy: ObjectId(createdBy),
			organizationId: ObjectId(organizationId),
		});
		const ticket = await newTicket.save();

		if (!ticket) return next(throwError(statusCodes.INTERNAL_ERROR));

		// Populate the customer field
		await ticket.populate("customer");

		io.emit("new-ticket", { ticket });

		res.status(statusCodes.CREATED).json({ ticket });
	} catch (error) {
		next(error);
	}
};

export const getTicketById = async (req, res, next) => {
	try {
		const ticket = await Ticket.findOne({
			ticketId: req.params.id,
		}).populate("customer");

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

export const deleteTicket = async (req, res, next) => {
	try {
		const id = parseInt(req.params.id);
		await db.collection("tickets").deleteOne({ ticketId: id });

		// Emit websocket for the ticket we deleted
		io.emit("delete-ticket", { ids: [id] });

		res.status(statusCodes.NO_CONTENT).send();
	} catch (error) {
		next(error);
	}
};

export const deleteTickets = async (req, res, next) => {
	try {
		const ids = JSON.parse(req.query.ids);
		await db.collection("tickets").deleteMany({ ticketId: { $in: ids } });

		// Emit websocket for the ticket we deleted
		io.emit("delete-ticket", { ids: ids });

		res.status(statusCodes.NO_CONTENT).send();
	} catch (error) {
		next(error);
	}
};

export const updateTicket = async (req, res, next) => {
	try {
		const id = req.params.id;
		const data = req.body;

		await db
			.collection("tickets")
			.updateOne({ ticketId: parseInt(id) }, { $set: data });

		// Emit websocket for the ticket we updated
		io.emit("update-ticket", { id, data });

		res.status(statusCodes.OK).send();
	} catch (error) {
		next(error);
	}
};
