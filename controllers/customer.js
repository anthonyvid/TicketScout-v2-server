import { statusCodes } from "../constants/statusCodes.constants.js";
import { db } from "../utils/db.js";
import { arrayToObject, throwError } from "../utils/helper.js";

export const getCustomers = async (req, res, next) => {
	try {
		const cursor = await db.collection("customers").find();
		if (!cursor) next(throwError(statusCodes.INTERNAL_ERROR));

		let customers = await cursor.toArray();
		customers = arrayToObject(customers, "_id");
		res.status(statusCodes.OK).json({ customers });
	} catch (error) {
		next(error);
	}
};

export const getCustomersById = async (req, res, next) => {
	try {
		const customer = await db
			.collection("customers")
			.findOne({ _id: ObjectId(req.params.id) });

		if (!customer) {
			next(throwError(statusCodes.INTERNAL_ERROR));
		}

		res.status(statusCodes.OK).json({ customer });
	} catch (error) {
		next(error);
	}
};
