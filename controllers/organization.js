import { statusCodes } from "../constants/statusCodes.constants.js";

export const getOrganizations = async (req, res) => {
	let names = ["anthonys store", "test", "compumaster"];
	names = names.filter((name) => name.toLowerCase());
	res.status(200).json({ organizations: names });
};

export const getDashboard = async (req, res) => {};

export const createOrganization = async (req, res) => {
	res.status(statusCodes.OK).json({ data: {} });
};

export const getOrganization = async (req, res) => {
	const { orgName } = req.body;
	console.log(orgName);
	const names = ["anthonys store", "test", "compumaster"];
	res.json(names);
};

export const isUniqueStoreName = async (req, res) => {
	const storeName = req.query.storeName;
	console.log(storeName);
	let names = ["anthonys store", "test", "compumaster"]; //todo: fetch db after

	try {
		names = names.filter((name) => name.toLowerCase());
		let isUnique = names.includes(storeName.trim().toLowerCase());

		res.status(statusCodes.OK).json({ isUnique: !isUnique });
	} catch (error) {
		res.status(statusCodes.INTERNAL_ERROR);
	}
};
