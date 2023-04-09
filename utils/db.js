import mongoose from "mongoose";
let db = mongoose.connection;
import mongoClient from "mongodb";
const { ObjectId } = mongoClient;

const initDatabase = (database = "ticketscout") => {
	db.close();
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
			db = mongoose.connection;
			console.log(`Connected to MongoDb: ${database}`);
		})
		.catch((err) => {
			console.log("Mongodb is not connected: ", err);
		});
};


export { db, ObjectId, initDatabase };
