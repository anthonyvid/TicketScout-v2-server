import mongoose from "mongoose";
import { ticketStatus } from "../constants/ticket.constants";
import Chat from "./Chat";
import Customer from "./Customer";
import User from "./User";

const TicketSchema = new mongoose.Schema(
	{
		subject: {
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
		chat: {
			type: Chat,
			required: true,
		},
	},
	{ timestamps: true }
);

const Ticket = mongoose.model("Ticket", TicketSchema);

export default Ticket;
