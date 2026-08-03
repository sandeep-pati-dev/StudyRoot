import User from "../models/user.model.js";
import { uploadProfileImage } from "../lib/cloudinary.js";
import { ApiError } from "../lib/utils.js";
import { ApiResponse } from "../lib/utils.js";
import bcrypt from "bcryptjs";

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId)
      .select("-password")
      .populate("activity.favoriteNotes", "title subject course semester")
      .populate("activity.downloadHistory.noteId", "title subject course semester");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
      new ApiResponse(200, user, "Profile retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching profile: " + error.message);
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      fullName,
      phoneNumber,
      dateOfBirth,
      gender,
      bio,
      location,
      currentCourse,
      currentSemester,
      university,
      studentId,
      branch,
      academicYear,
    } = req.body;

    // Validate required fields
    if (!fullName || !fullName.trim()) {
      throw new ApiError(400, "Full name is required");
    }

    // Validate semester range
    if (currentSemester && (parseInt(currentSemester) < 1 || parseInt(currentSemester) > 12)) {
      throw new ApiError(400, "Semester must be between 1 and 12");
    }

    // Validate course enum
    const validCourses = ["btech", "mca", "bca", "mba", "others"];
    if (currentCourse && !validCourses.includes(currentCourse)) {
      throw new ApiError(400, "Invalid course selection");
    }

    // Validate gender enum
    const validGenders = ["male", "female", "other"];
    if (gender && !validGenders.includes(gender)) {
      throw new ApiError(400, "Invalid gender selection");
    }

    // Prepare update data, converting empty strings to undefined for enum fields
    const updateData = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber?.trim() || undefined,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender: gender || undefined,
      bio: bio?.trim() || undefined,
      location: location?.trim() || undefined,
      currentCourse: currentCourse || undefined,
      currentSemester: currentSemester ? parseInt(currentSemester) : undefined,
      university: university?.trim() || undefined,
      studentId: studentId?.trim() || undefined,
      branch: branch?.trim() || undefined,
      academicYear: academicYear?.trim() || undefined,
    };

    // Get current user data to calculate profile completion
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      throw new ApiError(404, "User not found");
    }

    // Calculate profile completion with updated data
    const fields = [
      updateData.fullName,
      currentUser.email, // Use current email since it's not in updateData
      updateData.phoneNumber,
      updateData.dateOfBirth,
      updateData.gender,
      updateData.bio,
      updateData.currentCourse,
      updateData.currentSemester,
      updateData.university,
      updateData.studentId,
      updateData.branch,
    ];
    
    const completedFields = fields.filter(field => field && field !== "").length;
    const profileCompletion = Math.round((completedFields / fields.length) * 100);

    // Add profile completion to update data
    updateData.profileCompletion = profileCompletion;

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
      new ApiResponse(200, updatedUser, "Profile updated successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error updating profile: " + error.message);
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;
    
    if (!req.file) {
      throw new ApiError(400, "Profile picture is required");
    }

    // Upload to cloudinary using uploadProfileImage for buffer data
    const result = await uploadProfileImage(req.file.buffer);

    if (!result.secure_url) {
      throw new ApiError(500, "Error uploading image to cloudinary");
    }

    // Update user profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: result.secure_url },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
      new ApiResponse(200, updatedUser, "Profile picture updated successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error uploading profile picture: " + error.message);
  }
};

// Update user preferences
const updatePreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      notifications,
      theme,
      language,
      defaultCourse,
    } = req.body;

    const updateData = {};

    // Update notifications preferences
    if (notifications) {
      updateData["preferences.notifications"] = {
        email: notifications.email !== undefined ? notifications.email : true,
        downloads: notifications.downloads !== undefined ? notifications.downloads : true,
        courseUpdates: notifications.courseUpdates !== undefined ? notifications.courseUpdates : true,
      };
    }

    // Update theme
    if (theme && ["light", "dark"].includes(theme)) {
      updateData["preferences.theme"] = theme;
    }

    // Update language
    if (language) {
      updateData["preferences.language"] = language;
    }

    // Update default course
    if (defaultCourse && ["btech", "mca", "bca", "mba", "others"].includes(defaultCourse)) {
      updateData["preferences.defaultCourse"] = defaultCourse;
    }

    // Get current user to recalculate profile completion
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      throw new ApiError(404, "User not found");
    }

    // Recalculate profile completion
    const fields = [
      currentUser.fullName,
      currentUser.email,
      currentUser.phoneNumber,
      currentUser.dateOfBirth,
      currentUser.gender,
      currentUser.bio,
      currentUser.currentCourse,
      currentUser.currentSemester,
      currentUser.university,
      currentUser.studentId,
      currentUser.branch,
    ];
    
    const completedFields = fields.filter(field => field && field !== "").length;
    const profileCompletion = Math.round((completedFields / fields.length) * 100);

    // Add profile completion to update data
    updateData["profileCompletion"] = profileCompletion;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
      new ApiResponse(200, updatedUser, "Preferences updated successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error updating preferences: " + error.message);
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ApiError(400, "Current password and new password are required");
    }

    if (newPassword.length < 6) {
      throw new ApiError(400, "New password must be at least 6 characters long");
    }

    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Verify current password using bcrypt
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new ApiError(400, "Current password is incorrect");
    }

    // Hash new password using bcrypt
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password with hashed version
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedNewPassword },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
      new ApiResponse(200, {}, "Password changed successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error changing password: " + error.message);
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId)
      .populate("activity.downloadHistory.noteId", "title subject course semester")
      .populate("activity.favoriteNotes", "title subject course semester");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const stats = {
      totalDownloads: user.activity.totalDownloads,
      favoriteNotesCount: user.activity.favoriteNotes.length,
      recentDownloads: user.activity.downloadHistory.slice(-10), // Last 10 downloads
      profileCompletion: user.profileCompletion,
      memberSince: user.createdAt,
      lastLogin: user.activity.lastLogin,
    };

    return res.status(200).json(
      new ApiResponse(200, stats, "User statistics retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching user statistics: " + error.message);
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;

    if (!password) {
      throw new ApiError(400, "Password is required to delete account");
    }

    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(400, "Password is incorrect");
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json(
      new ApiResponse(200, {}, "Account deleted successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error deleting account: " + error.message);
  }
};


const getAllUser = async (req, res) => {
  try {
    const users = await User.find().sort({ fullName: 1 }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
}

const makeAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.role = "admin";
    await user.save();
    return res.status(200).json({
      user,
      message: "User role updated to admin successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating user role: " + error.message,
    });
  }
}

export {
  getUserProfile,
  updateProfile,
  uploadProfilePicture,
  updatePreferences,
  changePassword,
  getUserStats,
  deleteAccount,
  makeAdmin,
  getAllUser
}; 