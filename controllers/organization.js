import { statusCodes } from "../constants/statusCodes.constants.js";
import { isUniqueStoreName } from "../utils/helper.js";

export const getOrganizations = async (req, res, next) => {
	let names = ["anthonys store", "test", "compumaster"];
	names = names.filter((name) => name.toLowerCase());
	res.status(200).json({ organizations: names });
};

export const getDashboard = async (req, res, next) => {};

export const createOrganization = async (req, res) => {
	res.status(statusCodes.OK).json({ data: {} });
};

export const getOrganization = async (req, res, next) => {
	const { orgName } = req.body;

	const names = ["anthonys store", "test", "compumaster"];
	res.json(names);
};
