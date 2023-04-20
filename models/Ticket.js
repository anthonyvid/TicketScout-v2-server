import mongoose from "mongoose";
import { defaultTicketStatuses } from "../constants/server.constants.js";
import Sequence from "mongoose-sequence";
import { ObjectId } from "../utils/db.js";

const TicketSchema = new mongoose.Schema(
	{
		ticketId: {
			type: Number,
			unique: true,
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
			type: String,
			default: defaultTicketStatuses[0],
		},
		customer: {
			type: ObjectId,
			ref: "Customer",
			required: true,
		},
		typeId: {
			type: String,
			default: "",
		},
		createdBy: {
			type: ObjectId,
			ref: "User",
			required: true,
		},
		organizationId: {
			type: ObjectId,
			ref: "Organization",
			required: true,
		},
		chatHistory: {
			type: Array,
			default: [],
		},
		invoice: {
			type: ObjectId,
			ref: "Invoice",
			default: null,
		},
	},
	{ timestamps: true }
);

const AutoIncrement = Sequence(mongoose);
TicketSchema.plugin(AutoIncrement, { inc_field: "ticketId", start_seq: 2000 });

const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
