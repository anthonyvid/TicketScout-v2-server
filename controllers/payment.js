import { statusCodes } from "../constants/statusCodes.constants.js";
import { db } from "../utils/db.js";
import { arrayToObject, throwError } from "../utils/helper.js";

export const getPayments = async (req, res, next) => {
	try {
		const cursor = await db.collection("payments").find();
		if (!cursor) next(throwError(statusCodes.INTERNAL_ERROR));

		let payments = await cursor.toArray();
		payments = arrayToObject(payments, "paymentId");
		res.status(statusCodes.OK).json({ payments });
	} catch (error) {
		next(error);
	}
};

export const getPaymentById = async (req, res, next) => {
	try {
		const payment = await db
			.collection("payments")
			.findOne({ paymentId: req.params.id });

		if (!payment) {
			next(throwError(statusCodes.INTERNAL_ERROR));
		}

		res.status(statusCodes.OK).json({ payment });
	} catch (error) {
		next(error);
	}
};
