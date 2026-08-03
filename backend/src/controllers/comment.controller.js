import Comment from "../models/Comment.js";
import User from "../models/user.model.js";

export const createComment = async (req, res) => {
  try {
    const { subject, semester, content } = req.body;
    const user = req.user._id;

    if (!content || !subject || !semester) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newComment = new Comment({
      subject,
      semester,
      user,
      content,
    });

    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get comments for a subject and semester
export const getComments = async (req, res) => {
  try {
    const { subjectId, semesterId } = req.params;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 5;

    console.log(
      "Fetching comments for subjectId:",
      subjectId,
      "semesterId:",
      semesterId,
      "skip:",
      skip,
      "limit:",
      limit
    );

    const totalComments = await Comment.countDocuments({
      subject: subjectId,
      semester: semesterId,
    });

    const comments = await Comment.find({
      subject: subjectId,
      semester: semesterId,
    })
      .populate({ path: "user", model: User, select: "fullName profilePic" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ comments, totalComments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a comment by id
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only allow the user who posted the comment to delete it
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const likedIndex = comment.likes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    if (likedIndex === -1) {
      // User has not liked, add like
      comment.likes.push(userId);
    } else {
      // User has liked, remove like
      comment.likes.splice(likedIndex, 1);
    }

    await comment.save();

    res
      .status(200)
      .json({ likes: comment.likes.length, likedByUser: likedIndex === -1 });
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
