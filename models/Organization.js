import mongoose from "mongoose";

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
	},
	{ timestamps: true }
);

const Organization = mongoose.model("Organization", OrganizationSchema);

export default Organization;
