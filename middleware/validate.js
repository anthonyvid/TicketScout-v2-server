import validator from "validator";
import { planTypes } from "../constants/organization.constants.js";
import { statusCodes } from "../constants/statusCodes.constants.js";
import {
	isUniqueEmail,
	isUniqueStoreName,
	throwError,
} from "../utils/helper.js";
import { isPassword } from "../utils/helper.js";

export const validateUser = async (req, res, next) => {
	try {
		let {
			firstname,
			lastname,
			email,
			phoneNumber,
			password,
			confirmPassword,
			signUpCodeVerified,
		} = req.body;

		phoneNumber = phoneNumber.replace("-", "");

		// Validate First name
		if (!/^[A-Za-z\s]+$/.test(firstname))
			next(
				throwError(
					statusCodes.BAD_REQUEST,
					"First name is invalid.",
					"firstname"
				)
			);

		// Validate Last name
		if (!/^[A-Za-z\s]+$/.test(lastname))
			next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Last name is invalid.",
					"lastname"
				)
			);

		// Validate Email
		if (!validator.isEmail(email))
			next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Email is invalid.",
					"email"
				)
			);

		// Validate unique email
		if (!isUniqueEmail(email))
			next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Email is already taken.",
					"email"
				)
			);

		// Validate Phone number
		if (!validator.isMobilePhone(phoneNumber))
			next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Phone number is invalid.",
					"phoneNumber"
				)
			);

		// Validate password
		const { isValidPassword, passwordError } = isPassword(password);

		if (!isValidPassword)
			next(
				throwError(statusCodes.BAD_REQUEST, passwordError, "password")
			);

		// Validate confirm password
		if (confirmPassword !== password)
			next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Passwords do not match.",
					"confirmPassword"
				)
			);

		// Validate sign up code is good
		if (signUpCodeVerified === false)
			next(
				throwError(
					statusCodes.BAD_REQUEST,
					"There has been an error with your sign up code, try again."
				)
			);

		next();
	} catch (error) {
		next(error);
	}
};

export const validateStore = async (req, res, next) => {
	try {
		let { planType, storeName } = req.body;

		// Validate plan type
		if (!Object.values(planTypes).includes(planType))
			next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Invalid plan type, refresh and try again.",
					"planType"
				)
			);

		// Validate store name is unique
		if (!isUniqueStoreName(storeName))
			next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Store name is already taken.",
					"storeName"
				)
			);

		next();
	} catch (error) {
		next(error);
	}
};
