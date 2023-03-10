import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
	{
		type: {
			type: Number,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		sender: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;
