import mongoose from "mongoose";
import { defaultTicketStatuses } from "../constants/server.constants.js";

const OrganizationSchema = new mongoose.Schema(
	{
		storeName: {
			type: String,
			required: true,
			unique: true,
		},
		storeUrl: {
			type: String,
			required: true,
			unique: true,
		},
		address: {
			type: String,
			default: "",
		},
		phone: {
			type: String,
			default: "",
		},
		email: {
			type: String,
			default: "",
		},
		subscription: {
			type: Number,
			required: true,
		},
		settings: {
			type: Object,
			default: {
				ticketStatuses: defaultTicketStatuses,
			},
		},
	},
	{ timestamps: true }
);

const Organization = mongoose.model("Organization", OrganizationSchema);

export default Organization;
