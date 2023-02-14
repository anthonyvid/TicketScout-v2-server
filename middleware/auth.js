import jwt from "jsonwebtoken";
import { statusCodes } from "../constants/statusCodes.constants.js";
import { throwError } from "../utils/helper.js";

export const verifyToken = async (req, res, next) => {
	try {
		let { token } = req.body;

		if (!token) {
			const authHeader = req.header("authorization");
			if (authHeader.startsWith("Bearer "))
				token = authHeader.substring(7, authHeader.length);
		}

		if (!token)
			next(
				throwError(
					statusCodes.UNAUTHORIZED,
					"Please log in to view this resource."
				)
			);

		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		next();
	} catch (error) {
		next(error);
	}
};

export const verifyDatabase = (req, res, next) => {};
