import { Router } from "express";
import {
  getUserProfile,
  updateProfile,
  uploadProfilePicture,
  updatePreferences,
  changePassword,
  getUserStats,
  deleteAccount,
  makeAdmin,
  getAllUser
} from "../controllers/profile.controller.js";
import { protectRoute } from "../middleware/auth.moddleware.js";
import upload from "../middleware/multer.js";

const router = Router();


router.use(protectRoute);

// Get user profile
router.get("/", getUserProfile);

// Update user profile
router.put("/", updateProfile);

// Upload profile picture
router.put("/picture", upload.single("profilePicture"), uploadProfilePicture);

// Update user preferences
router.put("/preferences", updatePreferences);

// Change password
router.put("/password", changePassword);

// Get user statistics
router.get("/stats", getUserStats);

// Delete account
router.delete("/", deleteAccount);

router.get("/users", getAllUser);
// Make user an admin
router.put("/make-admin/:id", makeAdmin);

export default router; 