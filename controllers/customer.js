import { statusCodes } from "../constants/statusCodes.constants.js";
import { throwError } from "../utils/helper.js";
import Customer from "../models/Customer.js";
import { ObjectId } from "../utils/db.js";

export const getCustomers = async (req, res, next) => {
	try {
		res.json(res.paginatedResults);
	} catch (error) {
		next(error);
	}
};

export const getCustomersById = async (req, res, next) => {
	try {
		const customer = await Customer.findOne({
			_id: ObjectId(req.params.id),
		});

		if (!customer) {
			return next(throwError(statusCodes.INTERNAL_ERROR));
		}

		res.status(statusCodes.OK).json({ customer });
	} catch (error) {
		next(error);
	}
};

export const createCustomer = async (req, res, next) => {
	try {
		const { firstname, lastname, phone, email } = req.body;
		const organizationId = req.headers.organizationid;

		const newCustomer = new Customer({
			firstname,
			lastname,
			phone,
			email,
			organizationId: ObjectId(organizationId),
		});
		const customer = await newCustomer.save();

		if (!customer) return next(throwError(statusCodes.INTERNAL_ERROR));

		res.status(statusCodes.CREATED).json({ customer });
	} catch (error) {
		next(error);
	}
};
