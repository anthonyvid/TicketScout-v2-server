import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { statusCodes } from "../constants/statusCodes.constants.js";
import Stripe from "stripe";
import { planTypes } from "../constants/organization.constants.js";
import { throwError } from "../utils/helper.js";
import { db } from "../utils/db.js";

/* REGISTER USER */
export const register = async (req, res, next) => {
	try {
		const { firstName, lastName, email, password } = req.body;

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new User({
			firstName,
			lastName,
			email,
			password: passwordHash,
		});
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (error) {
		next(error);
	}
};

/* LOGGING IN */
export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email: email });
		if (!user) {
			next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Account does not exist.",
					"no_account"
				)
			);
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Invalid email or password.",
					"invalid_credentials"
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
		// loop through sign up codes in db, check if the code exists in there, if it does then return code, storename, and users email
		res.status(statusCodes.OK).json({ x: req.body });
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
		//
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
		const users = db.collection("users");
		const user = await users.findOne({ email: "anthonyvidovic@gmail.com" });

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
