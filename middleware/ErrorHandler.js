import { statusCodes } from "../constants/server.constants.js";

const ErrorHandler = (err, req, res, next) => {
	const errStatus = err.statusCode || statusCodes.INTERNAL_ERROR;
	let errMsg =
		err.message || "Something went wrong, refresh the application.";

	if (errStatus === statusCodes.INTERNAL_ERROR) {
		errMsg = `Something went wrong, please refresh and contact support.\nERROR:${res.sentry}`;
	}

	if (errStatus === statusCodes.NOT_FOUND) {
		// show error 404 page
	}

	// Send back error to client
	res.status(errStatus).json({
		success: false,
		status: errStatus,
		message: errMsg,
		key: err.key,
		errorId: res.sentry,
		stack: process.env.NODE_ENV === "development" ? err.stack : {},
	});
};

export default ErrorHandler;
