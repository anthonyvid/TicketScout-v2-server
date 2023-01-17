import mongoose from "mongoose";

const TimeSheetSchema = new mongoose.Schema(
	{
		employeeId: {
			type: String,
			required: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		approved: {
			type: Boolean,
			required: true,
		},
	},
	{ timestamps: true }
);

const TimeSheet = mongoose.model("TimeSheet", TimeSheetSchema);

export default TimeSheet;
