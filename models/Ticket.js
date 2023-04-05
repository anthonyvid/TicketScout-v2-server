import mongoose from "mongoose";
import { ticketStatus } from "../constants/ticket.constants.js";

const TicketSchema = new mongoose.Schema(
	{
		ticketId: {
			type: String,
			required: true,
		},
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
			default: ticketStatus.NEW,
		},
		customer: {
			type: mongoose.ObjectId,
			ref: "Customer",
			required: true,
		},
		typeId: {
			type: String,
			default: "",
		},
		createdBy: {
			type: mongoose.ObjectId,
			ref: "User",
			required: true,
		},
		chatHistory: {
			type: Array,
			default: [],
		},
		invoice: {
			type: mongoose.ObjectId,
			ref: "Invoice",
			required: true,
		},
	},
	{ timestamps: true }
);

const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
