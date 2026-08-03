import NoteRating from "../models/NoteRating.js";
import mongoose from "mongoose";

// Get average rating and total ratings for a note
export const getAverageNoteRating = async (req, res) => {
  const { noteId } = req.params;
  try {
    const result = await NoteRating.aggregate([
      { $match: { note: new mongoose.Types.ObjectId(noteId) } },
      {
        $group: {
          _id: "$note",
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({ averageRating: 0, totalRatings: 0 });
    }

    res.json({
      averageRating: result[0].averageRating,
      totalRatings: result[0].totalRatings,
    });
  } catch (error) {
    console.error("Error fetching average note rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit or update rating for a note by a user
export const submitNoteRating = async (req, res) => {
  const { noteId } = req.params;
  const { rating } = req.body;
  const userId = req.user._id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const existingRating = await NoteRating.findOne({
      user: userId,
      note: noteId,
    });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.json({ message: "Rating updated" });
    }

    const newRating = new NoteRating({
      user: userId,
      note: noteId,
      rating,
    });

    await newRating.save();
    res.json({ message: "Rating submitted" });
  } catch (error) {
    console.error("Error submitting note rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user's rating for a note
export const getUserNoteRating = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  try {
    const ratingDoc = await NoteRating.findOne({
      user: userId,
      note: noteId,
    });
    if (!ratingDoc) {
      return res.json({ rating: 0 });
    }
    res.json({ rating: ratingDoc.rating });
  } catch (error) {
    console.error("Error fetching user note rating:", error);
    res.status(500).json({ message: "Server error" });
  }
}; 