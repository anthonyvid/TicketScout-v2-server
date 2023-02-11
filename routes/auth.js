import express from "express";
import {
	login,
	register,
	verifySignUpCode,
	createCheckoutSession,
	checkoutSuccess,
	forgotPassword,
	uniqueEmail,
	uniqueStoreName,
	isAuthenticated,
} from "../controllers/auth.js";
import { validateUser } from "../middleware/validate.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", validateUser, register);
router.post("/forgot-password", forgotPassword);
router.post("/register/verify-sign-up-code", verifySignUpCode);
router.post("/register/check-unique-email", uniqueEmail);
router.post("/register/check-unique-store-name", uniqueStoreName);
router.post("/create-checkout-session", createCheckoutSession);
router.post("/checkout/success", checkoutSuccess);
router.post("/authenticate-user", verifyToken, isAuthenticated);

export default router;
