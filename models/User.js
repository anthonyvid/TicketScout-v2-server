import mongoose from "mongoose";
import { accountStatus, roles } from "../constants/server.constants.js";
import { ObjectId } from "../utils/db.js";

const UserSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			required: true,
		},
		lastname: {
			type: String,
			required: true,
		},
		roles: {
			type: Number,
			default: roles.BASIC,
		},
		address: {
			type: String,
			default: "",
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		organizationId: {
			type: ObjectId,
			ref: "Organization",
			required: true,
		},
		storeUrl: {
			type: String,
			required: true,
		},
		accountStatus: {
			type: Number,
			default: accountStatus.ACTIVE,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
