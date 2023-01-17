import mongoose from "mongoose";
import { permission } from "../constants/user.constants.js";

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
			type: String,
			default: permission.BASIC,
		},
		address: {
			street: {
				type: String,
				required: true,
			},
			city: {
				type: String,
				required: true,
			},
			province: {
				type: String,
				required: true,
			},
			country: {
				type: String,
				required: true,
			},
		},
		phone: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		jobTitle: String,
		contractType: {
			type: Number,
			required: true,
		},
		timesheets: mongoose.Schema.Types.Mixed,
		organizationId: {
			type: String,
			required: true,
		},
		organizationReferralId: {
			type: Number,
			required: true,
		},
		status: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
