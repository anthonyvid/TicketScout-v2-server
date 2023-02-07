import validator from "validator";
import { statusCodes } from "../constants/statusCodes.constants.js";

export const validateStore = async (req, res, next) => {
	let {
		firstname,
		lastname,
		email,
		phoneNumber,
		password,
		confirmPassword,
		planType,
		storeName,
		storeUrl,
	} = req.body;

	// Vaidate First name
	if (!/^[A-Za-z\s]+$/.test(firstname))
		return next(
			new Error(statusCodes.BAD_REQUEST, "First name is invalid.")
		);

	// Vaidate Last name
	if (!/^[A-Za-z\s]+$/.test(lastname))
		return next(
			new Error(statusCodes.BAD_REQUEST, "Last name is invalid.")
		);

	// Vaidate Email
	if (!validator.isEmail(email))
		return next(
			new Error(statusCodes.BAD_REQUEST, "Email is invalid.")
		);

	// Vaidate Phone number
	if (!validator.isMobilePhone(phoneNumber))
		return next(
			new Error(
				statusCodes.BAD_REQUEST,
				"Phone number is invalid."
			)
		);

	next();
};
