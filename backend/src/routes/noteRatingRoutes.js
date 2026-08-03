import express from "express";
import {
  getAverageNoteRating,
  submitNoteRating,
  getUserNoteRating,
} from "../controllers/note.rating.controller.js";
import { protectRoute } from "../middleware/auth.moddleware.js";

const router = express.Router();

// Get average rating for a note (public)
router.get("/note/:noteId", getAverageNoteRating);

// Submit or update rating for a note (protected)
router.post("/note/:noteId", protectRoute, submitNoteRating);

// Get current user's rating for a note (protected)
router.get("/note/:noteId/user", protectRoute, getUserNoteRating);

export default router; 