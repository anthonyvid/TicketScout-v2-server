import { isJsonString } from "../utils/helper.js";

export const handleSortFilter = (req, res, next) => {
	let { sort, filter } = req.query;

	// Build the sort object
	const sortObj = sort ? JSON.parse(sort) : { createdAt: "desc" };
	Object.keys(sortObj).forEach((key) => {
		if (sortObj[key] === "asc") {
			sortObj[key] = 1;
		} else if (sortObj[key] === "desc") {
			sortObj[key] = -1;
		}
	});

	const filterParam = filter || {};
	let query = {};
	const filterObj = isJsonString(filterParam) ? JSON.parse(filterParam) : {};

	// Build the query object
	if (filterObj) {
		Object.entries(filterObj).forEach(([key, value]) => {
			// Handle special cases like date filtering
			if (
				(key === "createdAt" || key === "updatedAt") &&
				typeof value === "object"
			) {
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

    req.sort = sortObj;
	req.filter = query;
	next();
};
