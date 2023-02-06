import mongoose from "mongoose";
import { subscription } from "../constants/store.constants";

const StoreSchema = new mongoose.Schema(
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

const Store = mongoose.model("Store", StoreSchema);

export default Store;
