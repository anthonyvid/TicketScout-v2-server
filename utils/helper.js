import { db } from "./db.js";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import nodemailer from "nodemailer";

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

export const sendPasswordResetEmail = async (
	{ _id, email },
	redirectUrl,
	next,
	res
) => {
	try {
		const users = db.collection("users");
		const passwordResetToken = v4 + _id;
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
			// Send email
			sendEmail({
				from: process.env.NODEMAILER_EMAIL,
				to: email,
				subject: "TicketScout Password Reset",
				html: `<p>We heard that you forgot your password.</p> <p>Dont worry, use the link below to reset it.</p>
                <p>This link <b>expires in 60 minutes</b>.</p><p>Press <a href=${url}>here</a> to proceed.
                `,
			});
		}

		console.log(user);
	} catch (error) {
		return error;
	}
};

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	service: "gmail",
	secure: false,
	auth: {
		user: process.env.NODEMAILER_EMAIL,
		pass: process.env.NODEMAILER_PASSWORD,
	},
});

export const sendEmail = async (options) => {
	try {
		const info = await transporter.sendMail(options);
		console.log(info);
	} catch (error) {
		return error;
	}
};
