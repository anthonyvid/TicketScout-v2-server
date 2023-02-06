import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { statusCodes } from "../constants/statusCodes.constants.js";
import Stripe from "stripe";
import { planType } from "../constants/user.constants.js";

/* REGISTER USER */
export const register = async (req, res) => {
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
		res.status(500).json({ error: error.message });
	}
};

/* LOGGING IN */
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email: email });
		if (!user)
			return res
				.status(statusCodes.BAD_REQUEST)
				.json({ msg: "Account does not exist.", key: "no_account" });

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch)
			return res.status(statusCodes.BAD_REQUEST).json({
				msg: "Invalid email or password.",
				key: "invalid_credentials",
			});

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
		delete user.password;
		res.status(statusCodes.OK).json({ token, user });
	} catch (error) {
		res.status(statusCodes.INTERNAL_ERROR).json({ error: error.message });
	}
};

export const verifySignUpCode = async (req, res) => {
	try {
		// loop through sign up codes in db, check if the code exists in there, if it does then return code, storename, and users email
		res.status(statusCodes.OK).json({ x: req.body });
	} catch (error) {
		res.status(statusCodes.INTERNAL_ERROR).json({ error: error.message });
	}
};

/* LOGGING OUT */
export const logout = async (req, res) => {
	try {
		//
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

/* FORGOT PASSWORD */
export const forgotPassword = async (req, res) => {
	try {
		//
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const createCheckoutSession = async (req, res) => {
	const { subscriptionType } = req.body;
	let priceId = "";

	if (subscriptionType === planType.STANDARD) {
		priceId = process.env.STANDARD_PAYMENT_ID;
	} else if (subscriptionType === planType.PRO) {
		priceId = process.env.PRO_PAYMENT_ID;
	}

	const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
	const session = await stripe.checkout.sessions.create({
		line_items: [{ price: priceId, quantity: 1 }],
		mode: "subscription",
		success_url: `${req.protocol}://${req.get("host")}${req.originalUrl}/success`,
		cancel_url: `http://localhost:3000/cancel`,
		customer_email: "customer@email.com",
	});

	res.send({ url: session.url });
};
