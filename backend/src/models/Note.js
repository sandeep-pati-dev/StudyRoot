import mongoose from "mongoose";
import { formatDate } from "../controllers/notes.controller.js";
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  fileFormat: {
    type: String,
    required: true,
    enum: ["pdf", "docx", "txt", "pptx", "xlsx"],
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileSize: {
    type: String,
  },
  uploadDate: {
    type: String,
    default: () => formatDate(new Date()),
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
});

// ✅ Prevent duplicate note titles under the same subject
noteSchema.index({ title: 1, subject: 1 }, { unique: true });
noteSchema.index({ fileUrl: 1, subject: 1 }, { unique: true });

const Note = mongoose.model("Note", noteSchema);
export default Note;
