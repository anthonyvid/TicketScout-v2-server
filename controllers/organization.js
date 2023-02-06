export const getOrganizations = async (req, res) => {
	let names = ["anthonys store", "test", "compumaster"];
	names = names.filter((name) => name.toLowerCase());
	res.status(200).json({ organizations: names });
};

export const getDashboard = async (req, res) => {};

export const createOrganization = async (req, res) => {};

export const getOrganization = async (req, res) => {
	const { orgName } = req.body;
	console.log(orgName);
	const names = ["anthonys store", "test", "compumaster"];
	res.json(names);
};
