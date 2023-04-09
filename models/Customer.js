import mongoose from "mongoose";
import { ObjectId } from "../utils/db.js";

const CustomerSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			required: true,
		},
		lastname: {
			type: String,
			required: true,
		},
		organizationId: {
			type: ObjectId,
			required: true,
		},
		address: {
			type: String,
			default: "",
		},
		phone: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Customer = mongoose.model("Customer", CustomerSchema);

export default Customer;
