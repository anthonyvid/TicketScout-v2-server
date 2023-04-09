import mongoose from "mongoose";
import { ObjectId } from "../utils/db.js";

const InvoiceSchema = new mongoose.Schema(
	{
		invoiceNumber: {
			type: String,
			required: true,
		},
		customer: {
			type: ObjectId,
			ref: "Customer",
			required: true,
		},
		ticket: {
			type: ObjectId,
			ref: "Ticket",
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		payment: {
			type: ObjectId,
			ref: "Payment",
			required: true,
		},
	},
	{ timestamps: true }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);

export default Invoice;
