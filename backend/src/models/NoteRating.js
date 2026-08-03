import mongoose from "mongoose";

const noteRatingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

// Prevent duplicate rating by same user for same note
noteRatingSchema.index({ user: 1, note: 1 }, { unique: true });

const NoteRating = mongoose.model("NoteRating", noteRatingSchema);
export default NoteRating; 