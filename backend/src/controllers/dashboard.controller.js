import Course from "../models/Course.js";
import Note from "../models/Note.js";

// Get dashboard statistics: total courses, total notes, total downloads
export const getDashboardStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalNotes = await Note.countDocuments();

    // Aggregate sum of downloads from all notes
    const downloadsResult = await Note.aggregate([
      {
        $group: {
          _id: null,
          totalDownloads: { $sum: "$downloads" },
        },
      },
    ]);

    const totalDownloads =
      downloadsResult.length > 0 ? downloadsResult[0].totalDownloads : 0;

    res.status(200).json({
      totalCourses,
      totalNotes,
      totalDownloads,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error });
  }
};
