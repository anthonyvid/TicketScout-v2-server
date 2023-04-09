import { statusCodes } from "../constants/statusCodes.constants.js";
import { permission } from "../constants/user.constants.js";
import Organization from "../models/Organization.js";
import { throwError } from "../utils/helper.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { db, ObjectId } from "../utils/db.js";

export const getOrganizations = async (req, res, next) => {
	try {
		res.json(res.paginatedResults);
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
			subscription: planType,
		});
		const org = await newOrganization.save();
		if (!org) return next(throwError(statusCodes.INTERNAL_ERROR));

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
			organizationId: ObjectId(org._id),
			storeUrl,
		});
		const user = await newUser.save();
		if (!user) {
			// User account couldnt be created so delete org account
			await db.collection("organizations").deleteOne({ _id: org._id });
			return next(throwError(statusCodes.INTERNAL_ERROR));
		}

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
		const organization = await Organization.findOne({
			_id: ObjectId(req.params.id),
		});

		if (!organization) {
			return next(throwError(statusCodes.INTERNAL_ERROR));
		}

		res.status(statusCodes.OK).json({ organization });
	} catch (error) {
		next(error);
	}
};
