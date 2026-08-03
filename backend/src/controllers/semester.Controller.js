import Semester from "../models/Semester.js";

// Get all semesters
export const getAllSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find();
    res.status(200).json(semesters);
  } catch (error) {
    res.status(500).json({ message: "Error fetching semesters", error });
  }
};

// Create a new semester
export const createSemester = async (req, res) => {
  try {
    const semester = new Semester(req.body);
    await semester.save();
    res.status(201).json(semester);
  } catch (error) {
    res.status(400).json({ message: "Error creating semester", error });
  }
};

// Get a semester by ID
export const getSemesterById = async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id);
    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }
    res.status(200).json(semester);
  } catch (error) {
    res.status(500).json({ message: "Error fetching semester", error });
  }
};

// Update a semester by ID
export const updateSemester = async (req, res) => {
  try {
    const semester = await Semester.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }
    res.status(200).json(semester);
  } catch (error) {
    res.status(400).json({ message: "Error updating semester", error });
  }
};

// Delete a semester by ID
export const deleteSemester = async (req, res) => {
  try {
    const semester = await Semester.findByIdAndDelete(req.params.id);
    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }
    res.status(200).json({ message: "Semester deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting semester", error });
  }
};
export const getSemestersByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const semesters = await Semester.find({ course: courseId }).sort({ number: 1 });
    res.status(200).json(semesters);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching semesters for course", error });
  }
};
