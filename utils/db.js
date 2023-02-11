import mongoose from "mongoose";
let db = mongoose.connection;
import mongoClient from "mongodb";
const { ObjectId } = mongoClient;

const initDatabase = (database = "entities") => {
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

const connectToDatabase = async (database = "entities") => {
	try {
		const options = { useCache: true, noListender: true };
		db = mongoose.connection.useDb(database, options);
		console.log(`Connected to MongoDb: ${database}`);
	} catch (error) {
		console.log("Mongodb is not connected: ", error);
	}
};

export { db, ObjectId, connectToDatabase, initDatabase };
