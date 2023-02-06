export const permission = Object.freeze({
	BASIC: 0,
	MANAGER: 1,
	ADMIN: 2,
});

export const contractType = Object.freeze({
	CONTRACT: 0,
	PART_TIME: 1,
	FULL_TIME: 2,
	INTERN: 3,
});

export const accountStatus = Object.freeze({
	INACTIVE: 0, // User signed up but account not yet activated
	ACTIVE: 1, // User account active
	DEACTIVATED: 2, // User account deactivated
});

export const planType = Object.freeze({
	BASIC: 0,
	STANDARD: 1,
	PRO: 2,
});
