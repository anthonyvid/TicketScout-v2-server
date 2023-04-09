import mongoose from "mongoose";
import { ObjectId } from "../utils/db.js";
import Invoice from "./Invoice.js";

const PaymentSchema = new mongoose.Schema(
	{
		paymentMethod: {
			type: Number,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		organizationId: {
			type: ObjectId,
			ref: "Organization",
			required: true,
		},
		invoiceId: {
			type: ObjectId,
			ref: "Invoice",
			required: true,
		},
	},
	{ timestamps: true }
);

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
