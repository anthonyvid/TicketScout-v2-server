import mongoose from "mongoose";

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
		tickets: {
			type: Array,
			default: [],
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
	},
	{ timestamps: true }
);

const Customer = mongoose.model("Customer", CustomerSchema);

export default Customer;
