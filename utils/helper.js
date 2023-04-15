import { db, ObjectId } from "./db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import validator from "validator";
import User from "../models/User.js";
import moment from "moment";

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

export const sendPasswordResetEmail = async ({ _id, email }, redirectUrl) => {
	try {
		const users = db.collection("users");
		const passwordResetToken = uuidv4() + _id;
		const url = `${redirectUrl}/${_id}/${passwordResetToken}`;
		const saltRounds = 10;

		// Delete existing reset token
		await users.updateOne({ _id }, { $unset: { passwordReset: "" } });

		const hashedResetToken = await bcrypt.hash(
			passwordResetToken,
			saltRounds
		);

		const user = await users.updateOne(
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

		if (user.acknowledged) {
			await sendEmail({
				from: process.env.NODEMAILER_EMAIL,
				to: email,
				subject: "TicketScout Password Reset",
				html: `<p>We heard that you forgot your password.</p> <p>Dont worry, use the link below to reset it.</p>
                <p>This link <b>expires in 60 minutes</b>.</p><p>Press <a href=${url}>here</a> to proceed.
                `,
			});
		}
	} catch (error) {
		return error;
	}
};

/**
 * Sends an email using nodemailer module
 * @param {string} msg
 */
export const sendEmail = async (msg) => {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.NODEMAILER_EMAIL,
			pass: process.env.NODEMAILER_PASSWORD,
		},
	});

	await transporter.sendMail(msg, (err) => {
		if (err) {
			throwError(statusCodes.INTERNAL_ERROR);
		}
	});
};

export const getUser = async (searchParam) => {
	try {
		let user = null;
		if (!validator.isEmail(searchParam)) {
			user = await User.findOne({ _id: ObjectId(searchParam) });
		} else {
			user = await User.findOne({ email: searchParam });
		}
		return user;
	} catch (error) {
		return error;
	}
};

export const arrayToObject = (array, key) => {
	const initialValue = {};
	return array.reduce((obj, item) => {
		return {
			...obj,
			[item[key]]: item,
		};
	}, initialValue);
};

export const isJsonString = (str) => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};

export const getWeeklyDataCount = (data) => {
	return [...Array(7)]
		.map((_, i) => {
			const date = moment().subtract(i, "days");
			const dateString = date.format("L");

			const count = data.reduce((total, d) => {
				const dataDate = moment(d.createdAt).format("L");
				if (dataDate === dateString) {
					return total + 1;
				} else {
					return total;
				}
			}, 0);

			return count;
		})
		.reverse();
};
