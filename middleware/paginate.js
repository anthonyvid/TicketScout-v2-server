import Organization from "../models/Organization.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Payment from "../models/Payment.js";
import { db, ObjectId } from "../utils/db.js";

export const paginateResults = (collection, orgSpecific = true) => {
	return async (req, res, next) => {
		const organizationId = req.headers.organizationid;
		const { sort, filter } = req;
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		const results = {};

		if (orgSpecific) filter.organizationId = new ObjectId(organizationId);

		try {
			const countPromise = getModel(collection).countDocuments();
			let cursor = Ticket.find(filter).sort(sort);

			if (collection === "tickets") {
				cursor = cursor.populate("customer");
			}

			cursor = cursor.skip(startIndex).limit(limit);

			const [count, paginatedResults] = await Promise.all([
				countPromise,
				cursor,
			]);

			results.results = paginatedResults;
			res.paginatedResults = results;

			results.total = count;

			if (endIndex < count) {
				results.next = {
					page: page + 1,
					limit,
				};
			}
			if (startIndex > 0) {
				results.previous = {
					page: page - 1,
					limit,
				};
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};

const getModel = (collection) => {
	switch (collection) {
		case "tickets":
			return Ticket;
		case "customers":
			return Customer;
		case "payments":
			return Payment;
		case "users":
			return User;
		case "organization":
			return Organization;
	}
};
