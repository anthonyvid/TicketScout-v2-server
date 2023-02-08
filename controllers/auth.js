import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { statusCodes } from "../constants/statusCodes.constants.js";
import Stripe from "stripe";
import { planTypes } from "../constants/organization.constants.js";
import { throwError } from "../utils/helper.js";

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
		const { planType } = req.body;
		let priceId = "";

		if (planType === planTypes.STANDARD) {
			priceId = process.env.STANDARD_PAYMENT_ID;
		} else if (planType === planTypes.PRO) {
			priceId = process.env.PRO_PAYMENT_ID;
		}

		const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
		const session = await stripe.checkout.sessions.create({
			line_items: [{ price: priceId, quantity: 1 }],
			mode: "subscription",
			success_url: `${req.protocol}://${req.get("host")}${
				req.originalUrl
			}/success`,
			cancel_url: `http://localhost:3000/cancel`,
			customer_email: "customer@email.com",
		});

		res.send({ url: session.url });
	} catch (error) {
		next(error);
	}
};
