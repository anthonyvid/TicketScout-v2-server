import { statusCodes } from "../constants/statusCodes.constants.js";
import { isUniqueEmail, throwError } from "../utils/helper.js";
import bcrypt from "bcrypt";

export const uniqueEmail = async (req, res, next) => {
	try {
		const email = req.query.email;
		const isUnique = await isUniqueEmail(email);
		res.status(statusCodes.OK).json({ isUnique: isUnique });
	} catch (error) {
		next(error);
	}
};

export const resetPassword = async (req, res, next) => {
	try {
		// get userID and reset token from params, also passwords
		// if there is a user, and that token is existing, and isnt expired
		// then we can reset password

		if (expiresAt < Date.now()) {
			//expired
			//delete token record from user
			next(
				throwError(
					statusCodes.BAD_REQUEST,
					"Your password reset link has expired."
				)
			);
		} else {
			// valid token
			const isMatch = await bcrypt.compare(resetToken, hashedTokenFromDB);

			if (!isMatch) {
				next(
					throwError(
						statusCodes.BAD_REQUEST,
						"Your password reser link is invalid. Please reset your password again."
					)
				);
			} else {
				const salt = await bcrypt.genSalt();
				const passwordHash = await bcrypt.hash(password, salt);
				//update user password with new hashed password

				//delete resetToken from user because its not needed anymore

				// res.status(statusCodes.OK).json({user})
			}
		}
		res.status(statusCodes.OK).json({ isUnique: isUnique });
	} catch (error) {
		next(error);
	}
};
