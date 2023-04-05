import mongoose from "mongoose";
import Invoice from "./Invoice.js";

const PaymentSchema = new mongoose.Schema(
	{
		paymentNumber: {
			type: String,
			required: true,
		},
		paymentMethod: {
			type: Number,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
