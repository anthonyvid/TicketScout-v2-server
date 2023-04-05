import { statusCodes } from "../constants/statusCodes.constants.js";
import { permission } from "../constants/user.constants.js";
import Organization, {
	initializeOrganization,
} from "../models/Organization.js";
import { isUniqueStoreName, throwError } from "../utils/helper.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { connectToDatabase, db, ObjectId } from "../utils/db.js";

export const getOrganizations = async (req, res, next) => {
	try {
		// Connect to entities
		await connectToDatabase();
		const cursor = await db.collection("organizations").find();
		if (!cursor) next(throwError(statusCodes.INTERNAL_ERROR));

		let orgs = await cursor.toArray();
		orgs = arrayToObject(orgs, "_id");
		res.status(statusCodes.OK).json({ organizations: orgs });
	} catch (error) {
		next(error);
	}
};

export const createOrganization = async (req, res, next) => {
	try {
		const {
			firstname,
			lastname,
			email,
			phoneNumber,
			storeName,
			password,
			planType,
			storeUrl,
		} = req.body;

		// Create organization account
		const newOrganization = new Organization({
			storeName,
			storeUrl,
		});
		const org = await newOrganization.save();
		if (!org) next(throwError(statusCodes.INTERNAL_ERROR));

		// Create user account
		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new User({
			firstname,
			lastname,
			permission: permission.ADMIN,
			email,
			phoneNumber,
			password: passwordHash,
			organizationId: org._id,
			storeUrl,
		});
		const user = await newUser.save();
		if (!user) {
			// User account couldnt be created so delete org account
			await db.collection("organizations").deleteOne({ _id: org._id });
			next(throwError(statusCodes.INTERNAL_ERROR));
		}

		// Create new organization Database
		initializeOrganization(org._id.toString());

		// Add user to organizations users
		await db.collection("users").insertOne(user);

		// Set org data
		await db.collection("organization").insertOne({
			address: {
				street: "",
				city: "",
				province: "",
				country: "",
			},
			phoneNumber: "",
			email: "",
			subscription: planType,
			storeName,
			storeUrl,
			organizationId: org._id,
		});

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

		res.status(statusCodes.OK).json({
			organization: org,
			user: user,
			token,
		});
	} catch (error) {
		next(error);
	}
};

export const getOrganizationById = async (req, res, next) => {
	try {
		const organization = await db
			.collection("organization")
			.findOne({ organizationId: ObjectId(req.params.id) });

		if (!organization) {
			next(throwError(statusCodes.INTERNAL_ERROR));
		}

		res.status(statusCodes.OK).json({ organization });
	} catch (error) {
		next(error);
	}
};
