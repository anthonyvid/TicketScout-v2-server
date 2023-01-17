import mongoose from "mongoose";
import { subscription } from "../constants/organization.constants";

const OrganizationSchema = new mongoose.Schema(
	{
		// _id: {
		// 	type: String,
		// 	unique: true,
		// },
		name: {
			type: String,
			required: true,
			unique: true,
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
		employees: mongoose.Schema.Types.Mixed,
		subscription: {
			type: Number,
			default: subscription.BASIC,
		},
	},
	{ timestamps: true }
);

const Organization = mongoose.model("Organization", OrganizationSchema);

export default Organization;
