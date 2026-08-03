import bcrypt from "bcryptjs";
import { Otp, PasswordResetOtp } from "../models/otp.model.js";
import User from "../models/user.model.js";
import { generateOTP, sendOtpEmail, generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Remove previous OTPs
    await Otp.deleteMany({ email });

    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    const hashedPassword = await bcrypt.hash(password, salt);

    const otpDoc = new Otp({
      email,
      otp: hashedOTP,
      fullName,
      password: hashedPassword,
    });

    await otpDoc.save();
    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("sendotp error:", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Verify OTP and create user
export const verifyotp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpDoc = await Otp.findOne({ email });

    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const isOtpValid = await bcrypt.compare(otp, otpDoc.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const now = new Date();
    const diff = (now - otpDoc.createdAt) / 1000;
    if (diff > 600) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    if (otpDoc.verified) {
      return res.status(400).json({ message: "OTP already verified" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      fullName: otpDoc.fullName,
      email: otpDoc.email,
      password: otpDoc.password,
    });

    otpDoc.verified = true;
    await otpDoc.save();
    await Otp.deleteOne({ _id: otpDoc._id });

    const token = generateToken(newUser._id, res);

    return res.status(201).json({
      message: "User registered successfully",
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      role: newUser.role,
      token,
    });
  } catch (err) {
    console.error("verifyotp error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({
          message: "Email not found. Please check your email or sign up.",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect password. Please try again." });
    }

    const token = generateToken(user._id, res);

    return res.status(200).json({
      message: "Login successful",
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logout error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log(`Error in check Auth Controller ${error.message}`);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }

    // Remove previous password reset OTPs
    await PasswordResetOtp.deleteMany({ email });

    // Generate and save new OTP
    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    const otpDoc = new PasswordResetOtp({
      email,
      otp: hashedOTP,
    });

    await otpDoc.save();
    await sendOtpEmail(email, otp);

    return res
      .status(200)
      .json({ message: "Password reset OTP sent successfully" });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res
      .status(500)
      .json({ message: "Failed to send password reset OTP" });
  }
};

// Verify Password Reset OTP
export const verifyPasswordResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpDoc = await PasswordResetOtp.findOne({ email });

    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const isOtpValid = await bcrypt.compare(otp, otpDoc.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const now = new Date();
    const diff = (now - otpDoc.createdAt) / 1000;
    if (diff > 300) {
      // 5 minutes
      await PasswordResetOtp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    // Mark OTP as verified instead of deleting it
    otpDoc.verified = true;
    await otpDoc.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("verifyPasswordResetOtp error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if there's a verified OTP for this email
    const otpDoc = await PasswordResetOtp.findOne({ email, verified: true });
    if (!otpDoc) {
      return res
        .status(400)
        .json({
          message: "No verified OTP found. Please verify your OTP first.",
        });
    }

    const now = new Date();
    const diff = (now - otpDoc.createdAt) / 1000;
    if (diff > 300) {
      await PasswordResetOtp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    // Delete OTP after successful password reset
    await PasswordResetOtp.deleteOne({ _id: otpDoc._id });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Resend OTP for signup
export const resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }
    // Find the previous Otp document to preserve fullName and password
    const previousOtp = await Otp.findOne({ email });
    // Remove previous OTPs
    await Otp.deleteMany({ email });
    // Generate and save new OTP
    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
    const otpDoc = new Otp({
      email,
      otp: hashedOTP,
      fullName: previousOtp?.fullName,
      password: previousOtp?.password,
    });
    await otpDoc.save();
    await sendOtpEmail(email, otp);
    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error("resendOtp error:", err);
    return res.status(500).json({ message: "Failed to resend OTP" });
  }
};

// Resend OTP for password reset
export const resendPasswordResetOtp = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }
    // Find the previous PasswordResetOtp document to preserve verified status
    const previousOtp = await PasswordResetOtp.findOne({ email });
    // Remove previous OTPs
    await PasswordResetOtp.deleteMany({ email });
    // Generate and save new OTP
    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
    const otpDoc = new PasswordResetOtp({
      email,
      otp: hashedOTP,
      verified: previousOtp?.verified || false,
    });
    await otpDoc.save();
    await sendOtpEmail(email, otp);
    return res
      .status(200)
      .json({ message: "Password reset OTP resent successfully" });
  } catch (err) {
    console.error("resendPasswordResetOtp error:", err);
    return res
      .status(500)
      .json({ message: "Failed to resend password reset OTP" });
  }
};
