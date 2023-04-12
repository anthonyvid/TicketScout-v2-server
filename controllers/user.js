import { statusCodes } from "../constants/server.constants.js";
import { getUser, throwError } from "../utils/helper.js";
import bcrypt from "bcrypt";
import { db, ObjectId } from "../utils/db.js";

export const resetPassword = async (req, res, next) => {
	try {
		const { password, id, token } = req.body;
		const users = db.collection("users");
		const userFromDb = await getUser(id);
		const expiresAt = userFromDb?.passwordReset?.expiresAt;
		const hashedTokenFromDB = userFromDb?.passwordReset?.token;

		if (expiresAt < Date.now()) {
			await users.updateOne(
				{ _id: ObjectId(id) },
				{ $unset: { passwordReset: "" } }
			);
			return next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Your password reset link has expired."
				)
			);
		} else {
			const isMatch = await bcrypt.compare(token, hashedTokenFromDB);

			if (!isMatch) {
				return next(
					throwError(
						statusCodes.BAD_REQUEST,
						"Your password reset link is invalid. Please reset your password again."
					)
				);
			} else {
				const salt = await bcrypt.genSalt();
				const passwordHash = await bcrypt.hash(password, salt);

				//update user password with new hashed password
				const user = await users.updateOne(
					{ _id: ObjectId(id) },
					{
						$set: {
							password: passwordHash,
						},
						$unset: {
							passwordReset: "",
						},
					}
				);

				if (user.acknowledged) {
					res.status(statusCodes.OK).json({
						email: userFromDb.email,
					});
				} else {
					return next(
						throwError(
							statusCodes.BAD_REQUEST,
							"Error resetting your password. Please try again."
						)
					);
				}
			}
		}
	} catch (error) {
		next(error);
	}
};

export const getUsers = async (req, res, next) => {
	try {
		res.json(res.paginatedResults);
	} catch (error) {
		next(error);
	}
};
