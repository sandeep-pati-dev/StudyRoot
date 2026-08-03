import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },

    // Personal Information
    phoneNumber: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    location: {
      type: String,
      trim: true,
    },
    // Academic Information
    currentCourse: {
      type: String,
      enum: ["btech", "mca", "bca", "mba", "others"],
    },
    currentSemester: {
      type: Number,
      min: 1,
      max: 12,
    },
    university: {
      type: String,
      trim: true,
    },
    studentId: {
      type: String,
      trim: true,
    },
    branch: {
      type: String,
      trim: true,
    },
    academicYear: {
      type: String,
      trim: true,
    },
    // Preferences
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        downloads: { type: Boolean, default: true },
        courseUpdates: { type: Boolean, default: true },
      },
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      language: {
        type: String,
        default: "en",
      },
      defaultCourse: {
        type: String,
        enum: ["btech", "mca", "bca", "mba", "others"],
      },
    },
    // Activity & Statistics
    activity: {
      lastLogin: {
        type: Date,
        default: Date.now,
      },
      totalDownloads: {
        type: Number,
        default: 0,
      },
      favoriteNotes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Note",
        },
      ],
      downloadHistory: [
        {
          noteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note",
          },
          downloadedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    // Profile completion
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Calculate profile completion percentage
userSchema.methods.calculateProfileCompletion = function () {
  const fields = [
    this.fullName,
    this.email,
    this.phoneNumber,
    this.dateOfBirth,
    this.gender,
    this.bio,
    this.currentCourse,
    this.currentSemester,
    this.university,
    this.studentId,
    this.branch,
  ];

  const completedFields = fields.filter(
    (field) => field && field !== ""
  ).length;
  return Math.round((completedFields / fields.length) * 100);
};

// Update profile completion before saving
userSchema.pre("save", function (next) {
  this.profileCompletion = this.calculateProfileCompletion();
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
