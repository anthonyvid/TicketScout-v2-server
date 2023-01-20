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
