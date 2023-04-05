import mongoose from "mongoose";
import Customer from "./Customer";
import Invoice from "./Invoice.js";
import User from "./User";

const TicketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: "",
		},
		status: {
			type: Number,
			default: ticketStatus,
		},
		customer: {
			type: Customer,
			required: true,
		},
		typeId: {
			type: String,
			default: "",
		},
		createdBy: {
			type: User,
			required: true,
		},
		chatHistory: {
			type: Array,
			default: [],
		},
		invoice: Invoice,
	},
	{ timestamps: true }
);

const Ticket = mongoose.model("Ticket", TicketSchema);

export default Ticket;
