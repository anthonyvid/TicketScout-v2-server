import { db, ObjectId } from "../utils/db.js";
import { isJsonString } from "../utils/helper.js";

export const paginateResults = (collection, orgSpecific = true) => {
	return async (req, res, next) => {
		const organizationId = req.headers.organizationid;
		const { sort, filter, order } = req;
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		const results = {};

		let query = {};
		const filterObj = isJsonString(filter) ? JSON.parse(filter) : {};

		// Build the query object
		if (filterObj) {
			Object.entries(filterObj).forEach(([key, value]) => {
				console.log(key, value);
				// Handle special cases like date filtering
				if (key === "createdAt" && typeof value === "object") {
					const { gt, gte, lt, lte } = value;
					if (gt || gte || lt || lte) {
						query.createdAt = {};
						if (gt) query.createdAt.$gt = new Date(gt);
						if (gte) query.createdAt.$gte = new Date(gte);
						if (lt) query.createdAt.$lt = new Date(lt);
						if (lte) query.createdAt.$lte = new Date(lte);
					}
				} else {
					// Support filtering by multiple values for the same key
					query[key] = Array.isArray(value) ? { $in: value } : value;
				}
			});
		}

		if (orgSpecific) {
			query.organizationId = new ObjectId(organizationId);
		}

		console.log(query);

		try {
			const countPromise = db.collection(collection).countDocuments();
			const cursor = db
				.collection(collection)
				.find(query)
				.sort({ [sort]: order })
				.skip(startIndex)
				.limit(limit);
			const [count, paginatedResults] = await Promise.all([
				countPromise,
				cursor.toArray(),
			]);

			results.results = paginatedResults;
			res.paginatedResults = results;

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
