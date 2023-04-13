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
			const countPromise = db.collection(collection).countDocuments();
			const cursor = db
				.collection(collection)
				.find(filter)
				.sort(sort)
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
