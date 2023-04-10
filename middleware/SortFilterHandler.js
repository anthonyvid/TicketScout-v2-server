export const handleSortFilter = (req, res, next) => {
	let { sort, filter } = req.query;

	// set default sort parameter if not provided
	const sortParam = sort || "createdAt:desc";
	const sortFields = sortParam.split(":");

	// set default filter parameter if not provided
	const filterParam = filter || {};

	// set default sort order parameter if not provided
	const sortOrder = sortFields[1] === "desc" ? -1 : 1;

	req.sort = sortFields[0];
	req.filter = filterParam;
	req.order = sortOrder;

	next();
};
