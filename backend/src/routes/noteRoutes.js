import express from "express";
import upload from "../middleware/multer.js";
import {
  uploadNote,
  downloadNote,
  viewNote,
  getNameByUserId,
  getNotesBySubject,
  getAllNotes,
  updateNote,
  deleteNote,
} from "../controllers/notes.controller.js";
import { isAdmin, protectRoute } from "../middleware/auth.moddleware.js";
// import { createNote, getAllNotes, getNoteById, updateNote, deleteNote } from '../controllers/note.controller.js';

const router = express.Router();

router.post(
  "/upload",
  protectRoute,
  isAdmin,
  upload.single("file"),
  uploadNote
);
router.get("/", protectRoute, getAllNotes);
router.get("/download/:id", protectRoute, downloadNote);
router.get("/view/:id", protectRoute, viewNote);
router.get("/subject/:subjectId", protectRoute, getNotesBySubject);
router.get("/name/:id", protectRoute, getNameByUserId);
router.put(
  "/update/:id",
  protectRoute,
  isAdmin,
  upload.single("file"),
  updateNote
);
router.delete("/:id", protectRoute, isAdmin, deleteNote);

// router.get('/:id', getNoteById);

export default router;
