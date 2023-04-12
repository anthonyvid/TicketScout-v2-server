import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Stripe from "stripe";
import {
	planTypes,
	statusCodes,
	accountStatus,
} from "../constants/server.constants.js";
import {
	getUser,
	isUniqueEmail,
	isUniqueStoreName,
	sendPasswordResetEmail,
	throwError,
} from "../utils/helper.js";
import { db, ObjectId } from "../utils/db.js";

import Organization from "../models/Organization.js";

/* REGISTER USER */
export const register = async (req, res, next) => {
	try {
		const {
			firstname,
			lastname,
			email,
			phoneNumber,
			password,
			organizationId,
			storeUrl,
			signUpCode,
		} = req.body;

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new User({
			firstname,
			lastname,
			email,
			phoneNumber,
			password: passwordHash,
			organizationId: ObjectId(organizationId),
			storeUrl,
		});
		const user = await newUser.save();

		if (!user) return next(throwError(statusCodes.INTERNAL_ERROR));

		// Delete sign up code
		// await db
		// 	.collection("inviteCodes")
		// 	.deleteOne({ code: signUpCode, organizationId }); //todo: remove comment after

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
		delete user.password;

		res.status(statusCodes.CREATED).json({ user, token });
	} catch (error) {
		next(error);
	}
};

/* LOGGING IN */
export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await getUser(email);
		if (!user) {
			return next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Account does not exist.",
					"no_account"
				)
			);
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Invalid email or password.",
					"invalid_credentials"
				)
			);
		}

		if (user.accountStatus !== accountStatus.ACTIVE) {
			return next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Your account is currently inactive."
				)
			);
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
		delete user.password;

		res.status(statusCodes.OK).json({ token, user });
	} catch (error) {
		next(error);
	}
};

export const verifySignUpCode = async (req, res, next) => {
	try {
		const { code } = req.body;
		const inviteCode = await db.collection("inviteCodes").findOne({ code });
		if (!inviteCode)
			next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Sign up code does not exist."
				)
			);

		if (inviteCode?.expiresAt < Date.now())
			next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Sign up code has expired. Please contact your employer to receive a new one."
				)
			);

		if (inviteCode)
			res.status(statusCodes.OK).json({
				code,
				storeUrl: inviteCode.storeUrl,
				organizationId: inviteCode.organizationId,
			});
	} catch (error) {
		next(error);
	}
};

/* LOGGING OUT */
export const logout = async (req, res, next) => {
	try {
		//
	} catch (error) {
		next(error);
	}
};

/* FORGOT PASSWORD */
export const forgotPassword = async (req, res, next) => {
	try {
		const { email } = req.body;
		const user = await getUser(email);

		if (user) {
			const clientBaseUrl = new URL(req.header("Referer")).origin;
			// send email
			sendPasswordResetEmail(
				user,
				`${clientBaseUrl}/account/reset-password`
			);
		}

		res.status(statusCodes.OK).json({ email });
	} catch (error) {
		next(error);
	}
};

export const createCheckoutSession = async (req, res, next) => {
	try {
		const { planType, email } = req.body;
		let priceId = "";

		if (planType === planTypes.STANDARD) {
			priceId = process.env.STANDARD_PAYMENT_ID;
		} else if (planType === planTypes.PRO) {
			priceId = process.env.PRO_PAYMENT_ID;
		} else {
			next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Issue processing payment. Please refresh and try again."
				)
			);
		}

		const clientBaseUrl = new URL(req.header("Referer")).origin;
		const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
		const session = await stripe.checkout.sessions.create({
			line_items: [{ price: priceId, quantity: 1 }],
			mode: "subscription",
			success_url: `${clientBaseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${clientBaseUrl}/account/login?from=checkout&email=${email}`,
			customer_email: email,
		});

		res.send({ url: session.url });
	} catch (error) {
		next(error);
	}
};

export const checkoutSuccess = async (req, res, next) => {
	try {
		const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
		const session = await stripe.checkout.sessions.retrieve(
			req.query.session_id
		);
		const email = session.customer_email;
		const user = await getUser(email);

		if (!user) {
			next(throwError(statusCodes.INTERNAL_ERROR));
		} else {
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
			res.status(statusCodes.OK).json({ user, token });
		}
	} catch (error) {
		next(error);
	}
};

export const uniqueEmail = async (req, res, next) => {
	try {
		const email = req.query.email;
		const isUnique = await isUniqueEmail(email);
		res.status(statusCodes.OK).json({ isUnique: isUnique });
	} catch (error) {
		next(error);
	}
};

export const uniqueStoreName = async (req, res, next) => {
	try {
		const storeName = req.query.storeName;
		const isUnique = await isUniqueStoreName(storeName);
		res.status(statusCodes.OK).json({ isUnique: isUnique });
	} catch (error) {
		next(error);
	}
};

export const isAuthenticated = async (req, res, next) => {
	try {
		const { _id, organizationId, accountStatus, email } = req.body.user;

		const organization = await Organization.findOne({
			_id: ObjectId(organizationId),
		});
		const user = await getUser(_id);

		const authorized =
			!user ||
			!organization ||
			user.organizationId.toString() !== organization._id.toString() ||
			user.accountStatus !== accountStatus.ACTIVE ||
			user.email !== email;

		if (!authorized) {
			return next(
				throwError(
					statusCodes.FORBIDDEN,
					"Access denied due to invalid credentials. Please log in."
				)
			);
		} else if (organization.storeName !== req.body.storeNameFromUrl) {
			return next(throwError(statusCodes.NOT_FOUND));
		} else {
			res.status(statusCodes.OK).send();
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
};
