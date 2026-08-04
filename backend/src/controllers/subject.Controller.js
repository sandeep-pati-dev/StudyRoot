import Subject from "../models/Subject.js";
import Semester from "../models/Semester.js";


// Get all subjects
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects", error });
  }
};

// Create a new subject
export const createSubject = async (req, res) => {
  try {
    const { name, subjectCode, course, semester, semesterNumber } = req.body;

    if (!name || !subjectCode || !course || (!semester && !semesterNumber)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let foundSemester;
    if (semester) {
      foundSemester = await Semester.findById(semester);
    } else {
      foundSemester = await Semester.findOne({
        course,
        number: semesterNumber,
      });
    }

    if (!foundSemester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    const existing = await Subject.findOne({
      name,
      semester: foundSemester._id,
    });

    if (existing) {
      return res.status(409).json({ message: "Subject already exists in this semester" });
    }

    const subject = await Subject.create({
      name,
      subjectCode,
      semester: foundSemester._id,
    });

    res.status(201).json(subject);
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Get a subject by ID
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subject", error });
  }
};

// Update a subject by ID
export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(400).json({ message: "Error updating subject", error });
  }
};

// Delete a subject by ID
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subject", error });
  }
};

export const getSubjectBySemester = async (req, res) => {
  const { semesterId } = req.params;
  try {
    const subjects = await Subject.find({ semester: semesterId }).sort({ number: 1 });
    res.status(200).json(subjects);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching subjects for semester", error });
  }
};
