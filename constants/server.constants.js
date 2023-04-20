export const messageType = Object.freeze({
	PUBLIC: 0,
	PRIVATE: 1,
});
export const planTypes = Object.freeze({
	BASIC: 0,
	STANDARD: 1,
	PRO: 2,
});
export const paymentMethods = Object.freeze({
	CASH: 0,
	CREDIT: 1,
	DEBIT: 2,
});

export const statusCodes = {
	OK: 200, // Success
	CREATED: 201, // Success, new resource created
	ACCEPTED: 202, // Success, usually for actions that take long to process
	NO_CONTENT: 204, // Success, but no content sent back (PUT, POST, DELETE)
	BAD_REQUEST: 400, // Generic client-side error status
	UNAUTHORIZED: 401, // Trying to access private stuff without auth
	PAYMENT_REQUIRED: 402,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_ERROR: 500, // server issue
};

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export const ticketStatus = Object.freeze({
	NEW: 0,
	REPLY: 1,
	PRIORITY: 2,
	//todo: add more
});
export const roles = Object.freeze({
	BASIC: 0,
	MANAGER: 1,
	ADMIN: 2,
	SUPER_USER: 3,
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
