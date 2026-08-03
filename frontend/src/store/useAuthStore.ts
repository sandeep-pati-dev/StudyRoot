import { create } from "zustand";
import axios from "@/lib/axiosInstance";
import toast from "react-hot-toast";

// Define user type based on your API response structure
interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profilePic?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  location?: string;
  currentCourse?: string;
  currentSemester?: number;
  university?: string;
  studentId?: string;
  branch?: string;
  academicYear?: string;
  preferences?: {
    notifications: {
      email: boolean;
      downloads: boolean;
      courseUpdates: boolean;
    };
    theme: string;
    language: string;
    defaultCourse?: string;
  };
  activity?: {
    lastLogin: string;
    totalDownloads: number;
    favoriteNotes: any[];
    downloadHistory: any[];
  };
  profileCompletion: number;
  createdAt: string;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthStore {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  isVerifyingOtp: boolean;
  isForgotPassword: boolean;
  isVerifyingPasswordResetOtp: boolean;
  isResettingPassword: boolean;
  otpStep: boolean;
  forgotPasswordStep: boolean;
  resetPasswordStep: boolean;
  signupEmail?: string;
  forgotPasswordEmail?: string;

  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  login: (data: LoginData) => Promise<boolean>;
  logout: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  verifyPasswordResetOtp: (email: string, otp: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  resetForgotPasswordState: () => void;
}


export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isVerifyingOtp: false,
  isForgotPassword: false,
  isVerifyingPasswordResetOtp: false,
  isResettingPassword: false,
  otpStep: false,
  forgotPasswordStep: false,
  resetPasswordStep: false,

  checkAuth: async () => {
    try {
      const res = await axios.get<AuthUser>("/auth/check");

      set({ authUser: res.data });
      console.log("Auth user inside checkAuth:", res.data.role);
    } catch (error) {
      console.log("Error in checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: SignupData) => {
    set({ isSigningUp: true });
    try {
      await axios.post("/auth/signup", data);
      toast.success("OTP sent to your email");
      set({ otpStep: true, signupEmail: data.email });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyOtp: async (email: string, otp: string) => {
    set({ isVerifyingOtp: true });
    try {
      const res = await axios.post<AuthUser>("/auth/verify-otp", { email, otp });
      set({ authUser: res.data, otpStep: false });
      toast.success("Signup successful!");
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
      return false;
    } finally {
      set({ isVerifyingOtp: false });
    }
  },

  login: async (data: LoginData) => {
    set({ isLoggingIn: true });
    try {
      await axios.post("/auth/login", data);
      const userRes = await axios.get<AuthUser>("/auth/check");
      set({ authUser: userRes.data });
      toast.success("Logged in successfully");
      console.log("userRes:", userRes);
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("authUser");
      toast.success("Logged out successfully");
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Logout failed");
      return false;
    }
  },

  forgotPassword: async (email: string) => {
    set({ isForgotPassword: true });
    try {
      await axios.post("/auth/forgot-password", { email });
      toast.success("Password reset OTP sent to your email");
      set({ forgotPasswordStep: true, forgotPasswordEmail: email });
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send password reset OTP");
      return false;
    } finally {
      set({ isForgotPassword: false });
    }
  },

  verifyPasswordResetOtp: async (email: string, otp: string) => {
    set({ isVerifyingPasswordResetOtp: true });
    try {
      await axios.post("/auth/verify-password-reset-otp", { email, otp });
      toast.success("OTP verified successfully");
      set({ forgotPasswordStep: false, resetPasswordStep: true });
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
      return false;
    } finally {
      set({ isVerifyingPasswordResetOtp: false });
    }
  },

  resetPassword: async (email: string, newPassword: string) => {
    set({ isResettingPassword: true });
    try {
      await axios.post("/auth/reset-password", { email, newPassword });
      toast.success("Password reset successfully");
      // Reset all forgot password related states
      set({ 
        forgotPasswordStep: false, 
        resetPasswordStep: false, 
        forgotPasswordEmail: undefined,
        isForgotPassword: false,
        isVerifyingPasswordResetOtp: false,
        isResettingPassword: false
      });
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Password reset failed");
      return false;
    } finally {
      set({ isResettingPassword: false });
    }
  },

  resetForgotPasswordState: () => {
    set({ 
      forgotPasswordStep: false, 
      resetPasswordStep: false, 
      forgotPasswordEmail: undefined 
    });
  },
}));