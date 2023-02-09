import express from "express";
import {
	login,
	register,
	verifySignUpCode,
	createCheckoutSession,
	checkoutSuccess,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/register/verifySignUpCode", verifySignUpCode);
router.post("/create-checkout-session", createCheckoutSession);
router.post("/checkout/success", checkoutSuccess);


export default router;
