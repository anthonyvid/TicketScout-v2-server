import mongoose from "mongoose";
import { accountStatus, permission } from "../constants/user.constants.js";

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
		permission: {
			type: Number,
			default: permission.BASIC,
		},
		address: {
			street: {
				type: String,
			},
			city: {
				type: String,
			},
			province: {
				type: String,
			},
			country: {
				type: String,
			},
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
			type: String,
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
