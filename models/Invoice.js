import mongoose from "mongoose";
import Customer from "./Customer.js";
import Payment from "./Payment.js";
import Ticket from "./Ticket.js";

const InvoiceSchema = new mongoose.Schema(
	{
		invoiceNumber: {
			type: String,
			required: true,
		},
		customer: {
			type: Customer,
			required: true,
		},
		ticket: {
			type: Ticket,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		payment: {
			type: Payment,
			required: true,
		},
	},
	{ timestamps: true }
);

const Invoice = mongoose.model("Customer", InvoiceSchema);

export default Invoice;
