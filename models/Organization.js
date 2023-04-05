import mongoose from "mongoose";
import { connectToDatabase, db } from "../utils/db.js";

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
	},
	{ timestamps: true }
);

const Organization = mongoose.model("Organization", OrganizationSchema);

export const initializeOrganization = async (id) => {
	await connectToDatabase(id);
	await db.createCollection("payments");
	await db.createCollection("customers");
	await db.createCollection("tickets");
};

export default Organization;
