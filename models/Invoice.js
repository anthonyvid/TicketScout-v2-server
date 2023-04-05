import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
	{
		invoiceNumber: {
			type: String,
			required: true,
		},
		customer: {
			type: mongoose.ObjectId,
			ref: "Customer",
			required: true,
		},
		ticket: {
			type: mongoose.ObjectId,
			ref: "Ticket",
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		payment: {
			type: mongoose.ObjectId,
			ref: "Payment",
			required: true,
		},
	},
	{ timestamps: true }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);

export default Invoice;
