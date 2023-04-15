import { statusCodes } from "../constants/server.constants.js";
import { getWeeklyDataCount, throwError } from "../utils/helper.js";
import Payment from "../models/Payment.js";

export const getPayments = async (req, res, next) => {
	try {
		res.json(res.paginatedResults);
	} catch (error) {
		next(error);
	}
};

export const getPaymentById = async (req, res, next) => {
	try {
		const payment = await Payment.findOne({ paymentId: req.params.id });

		if (!payment) {
			return next(throwError(statusCodes.INTERNAL_ERROR));
		}

		res.status(statusCodes.OK).json({ payment });
	} catch (error) {
		next(error);
	}
};

export const createPayment = async (req, res, next) => {
	try {
		const { title, description, customerId, userId, orgId } = req.body;

		const newTicket = new Payment({
			title,
			description,
			customer: ObjectId(customerId),
			createdBy: ObjectId(userId),
			organizationId: ObjectId(orgId),
		});
		const ticket = await newTicket.save();

		if (!ticket) return next(throwError(statusCodes.INTERNAL_ERROR));

		res.status(statusCodes.CREATED).json({ ticket });
	} catch (error) {
		next(error);
	}
};

export const getWeeklyPaymentCount = async (req, res, next) => {
	try {
		const data = res.paginatedResults;
		data.results = getWeeklyDataCount(data.results);
		res.status(statusCodes.OK).json(data);
	} catch (error) {
		next(error);
	}
};
