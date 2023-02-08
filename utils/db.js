import mongoose from "mongoose";
const db = mongoose.connection;

const connectToDatabase = (database = "entities") => {
	mongoose.set("strictQuery", true);
	mongoose
		.connect(
			`${process.env.MONGO_URL}${database}?retryWrites=true&w=majority`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		)
		.then((response) => {
			console.log(`Connected to MongoDb: ${database}`);
		})
		.catch((err) => {
			console.log("Mongodb is not connected: ", err);
		});
};

export { db, connectToDatabase };
