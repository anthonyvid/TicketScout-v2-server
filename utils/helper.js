import { db } from "./db.js";
import bcrypt from "bcrypt";

export const isString = (str) => {
	return Object.prototype.toString.call(str) === "[object String]";
};

export const isPassword = (password) => {
	if (!isString(password))
		return { isValidPassword: false, passwordError: "Invalid Password." };

	if (password.length < 5)
		return {
			isValidPassword: false,
			passwordError: "Password must be at least 5 characters.",
		};

	if (password.length > 64)
		return {
			isValidPassword: false,
			passwordError: "Password cannot exceed 64 characters.",
		};

	if (!/^(?=.*[a-z])/.test(password))
		return {
			isValidPassword: false,
			passwordError: "Password must include lowercase letter.",
		};

	if (!/^(?=.*[A-Z])/.test(password))
		return {
			isValidPassword: false,
			passwordError: "Password must include uppercase letter.",
		};

	if (!/^(?=.*[0-9])/.test(password))
		return {
			isValidPassword: false,
			passwordError: "Password must include digit.",
		};

	if (!/^(?=.*[!@#\$%\^&\*])/.test(password))
		return {
			isValidPassword: false,
			passwordError: "Password must include special character.",
		};

	return { isValidPassword: true, passwordError: "" };
};

export const isUniqueStoreName = async (storeName) => {
	try {
		const organizations = db.collection("organizations");
		const store = await organizations.findOne({ storeName });
		if (!store) return true;
		return false;
	} catch (error) {
		return error;
	}
};

export const isUniqueEmail = async (email) => {
	try {
		const users = db.collection("users");
		const user = await users.findOne({ email });
		if (!user) return true;
		return false;
	} catch (error) {
		return error;
	}
};

export const throwError = (status, message, key = null) => {
	const error = new Error(message);
	error.statusCode = status;
	error.key = key;
	return error;
};

export const sendPasswordResetEmail = (
	{ _id, email },
	redirectUrl,
	next,
	res
) => {
	const users = db.collection("users");

	const passwordResetToken = "";

	const url = `${redirectUrl}/${_id}/${passwordResetToken}`;
	const saltRounds = 10;
	bcrypt
		.hash(passwordResetToken, saltRounds)
		.then((hashedResetToken) => {
			const user = users.updateOne(
				{ _id },
				{
					$set: {
						passwordReset: {
							token: hashedResetToken,
							createdAt: Date.now(),
							expiresAt: Date.now() + 3600000,
						},
					},
				}
			);

			//check if updated went trhough
			//send email
		})
		.error((error) => {
			next(error);
		});
};
