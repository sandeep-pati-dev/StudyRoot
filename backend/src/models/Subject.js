import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
    // unique: true,
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true,
  },
});

// ✅ Ensure subject name is unique per semester
subjectSchema.index({ name: 1, semester: 1 }, { unique: true });

// ✅ Optionally, ensure subjectCode is also unique per semester
subjectSchema.index({ subjectCode: 1, semester: 1 }, { unique: true });

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
