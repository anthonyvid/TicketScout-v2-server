import { isJsonString } from "../utils/helper.js";

export const handleSortFilter = (req, res, next) => {
	let { sort, filter } = req.query;
	console.log(sort);
	// set default sort parameter if not provided
	const sortParam = sort || "createdAt:desc";
	const sortFields = sortParam.split(":");

	// set default sort order parameter if not provided
	const sortOrder = sortFields[1] === "desc" ? -1 : 1;

	const filterParam = filter || {};
	let query = {};
	const filterObj = isJsonString(filterParam) ? JSON.parse(filterParam) : {};

	// Build the query object
	if (filterObj) {
		Object.entries(filterObj).forEach(([key, value]) => {
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

	req.sort = sortFields[0];
	req.filter = query;
	req.order = sortOrder;

	next();
};
