import { statusCodes } from "../constants/statusCodes.constants.js";
import { isUniqueEmail } from "../utils/helper.js";

export const uniqueEmail = async (req, res, next) => {
	try {
		const email = req.query.email;
		const isUnique = await isUniqueEmail(email);
		res.status(statusCodes.OK).json({ isUnique: isUnique });
	} catch (error) {
		next(error);
	}
};
