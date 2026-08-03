import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

const passwordResetOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 5 minutes
  },
});

const Otp = mongoose.model("Otp", otpSchema);
const PasswordResetOtp = mongoose.model("PasswordResetOtp", passwordResetOtpSchema);

export { Otp, PasswordResetOtp };
export default Otp;
