export const getCustomers = (req, res, next) => {
	res.json({ customers: { 1: 1 } });
};
export const getCustomersById = (req, res, next) => {
	res.json({ customer: { 1: 1 } });
};
