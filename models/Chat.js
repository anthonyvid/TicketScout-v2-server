import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
	{
		ticketId: {
			type: Number,
			required: true,
		},
		history: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
