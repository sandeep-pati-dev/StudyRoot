import express from "express";
import {
  signup,
  login,
  logout,
  verifyotp,
  checkAuth,
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword,
  resendOtp,
  resendPasswordResetOtp,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.moddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-otp", verifyotp);
router.post("/resend-otp", resendOtp);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-password-reset-otp", verifyPasswordResetOtp);
router.post("/reset-password", resetPassword);
router.post("/resend-password-reset-otp", resendPasswordResetOtp);

router.get("/check", protectRoute, checkAuth);
export default router;
