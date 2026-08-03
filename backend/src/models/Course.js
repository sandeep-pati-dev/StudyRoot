import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  totalSemesters: {
    type: Number,
    required: true,
    default: 8,
  },
});
const Course = mongoose.model("Course", courseSchema);
export default Course;
