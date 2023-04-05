export const getPayments = (req, res, next) => {
	res.json({ payments: { 1: 1 } });
};

export const getPaymentById = (req, res, next) => {
	res.json({ payment: { 1: 1 } });
};
