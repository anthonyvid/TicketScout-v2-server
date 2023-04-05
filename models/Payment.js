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
		invoiceReference: {
			type: Invoice,
			required: true,
		},
	},
	{ timestamps: true }
);

const Payment = mongoose.model("Customer", PaymentSchema);

export default Payment;
