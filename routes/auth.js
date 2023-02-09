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
} from "../controllers/auth.js";
import { validateUser } from "../middleware/validate.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", validateUser, register);
router.post("/forgot-password", forgotPassword);
router.post("/register/verify-sign-up-code", verifySignUpCode);
router.post("/register/check-unique-email", uniqueEmail);
router.post("/register/check-unique-store-name", uniqueStoreName);
router.post("/create-checkout-session", createCheckoutSession);
router.post("/checkout/success", checkoutSuccess);

export default router;
