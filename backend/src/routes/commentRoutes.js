import express from "express";
import {
  createComment,
  getComments,
  deleteComment,
  likeComment,
} from "../controllers/comment.controller.js";
import { protectRoute } from "../middleware/auth.moddleware.js";

const router = express.Router();

// Get comments for a subject and semester
router.get("/:subjectId/:semesterId", getComments);

// Create a new comment (authenticated)
router.post("/", protectRoute, createComment);

// Delete a comment by id (authenticated)
router.delete("/:commentId", protectRoute, deleteComment);

// Like a comment (authenticated)
router.post("/:commentId/like", protectRoute, likeComment);

export default router;
