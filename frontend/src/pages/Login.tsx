import axios from "@/lib/axiosInstance";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, User, Key, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const {
    signup,
    verifyOtp,
    login,
    forgotPassword,
    verifyPasswordResetOtp,
    resetPassword,
    resetForgotPasswordState,
    isSigningUp,
    isLoggingIn,
    isVerifyingOtp,
    isForgotPassword,
    isVerifyingPasswordResetOtp,
    isResettingPassword,
    otpStep,
    forgotPasswordStep,
    resetPasswordStep,
    signupEmail,
    forgotPasswordEmail,
    authUser,
  } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      navigate("/dashboard");
    }
  }, [authUser, navigate]);


  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  // Debug useEffect to monitor state changes
  useEffect(() => {
    console.log("State changed:", { forgotPasswordStep, resetPasswordStep, otpStep, isLogin });
  }, [forgotPasswordStep, resetPasswordStep, otpStep, isLogin]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendDisabled && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
      setResendTimer(30);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, resendTimer]);

  const handleResendOtp = async () => {
    if (!signupEmail) {
      toast.error("No email found for OTP resend");
      return;
    }
    setResendDisabled(true);
    try {
      await axios.post("/auth/resend-otp", { email: signupEmail });
      toast.success("OTP resent to your email");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
      setResendDisabled(false);
      setResendTimer(30);
    }
  };

  const handleResendPasswordResetOtp = async () => {
    if (!forgotPasswordEmail) {
      toast.error("No email found for OTP resend");
      return;
    }
    setResendDisabled(true);
    try {
      await axios.post("/auth/resend-password-reset-otp", { email: forgotPasswordEmail });
      toast.success("Password reset OTP resent to your email");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to resend password reset OTP");
      setResendDisabled(false);
      setResendTimer(30);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (forgotPasswordStep) {
      const success = await verifyPasswordResetOtp(forgotPasswordEmail!, otp);
      if (success) {
        setOtp("");
      }
      return;
    }

    if (resetPasswordStep) {
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      const success = await resetPassword(forgotPasswordEmail!, newPassword);
      if (success) {
        console.log("Password reset successful, reloading page...");
        // Force page reload to show login form
        window.location.reload();
      }
      return;
    }

    if (otpStep) {
      const success = await verifyOtp(signupEmail!, otp);
      if (success) {
        setOtp("");
        setFormData({ fullName: "", email: "", password: "" });
        navigate("/dashboard");
      }
      return;
    }

    if (isLogin) {
      const success = await login({
        email: formData.email,
        password: formData.password,
      });
      if (success) {
        setFormData({ fullName: "", email: "", password: "" });
        navigate("/dashboard");
      }
    } else {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }
    const success = await forgotPassword(formData.email);
    if (success) {
      setOtp("");
    }
  };

  const handleBackToLogin = () => {
    resetForgotPasswordState();
    setFormData({ fullName: "", email: "", password: "" });
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setIsLogin(true);
  };

  const getCurrentStep = () => {
    console.log("getCurrentStep called with states:", { forgotPasswordStep, resetPasswordStep, otpStep, isLogin });
    if (forgotPasswordStep) return "forgot-password-otp";
    if (resetPasswordStep) return "reset-password";
    if (otpStep) return "signup-otp";
    return isLogin ? "login" : "signup";
  };

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-screen flex">
      {/* Left - Motivation */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-studyroot-blue via-studyroot-purple to-studyroot-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <GraduationCap className="h-8 w-8" />
            </div>
            <span className="text-3xl font-bold">StudyRoot</span>
          </div>
          <h1 className="text-4xl font-bold text-center mb-6">
            Study Smarter, <br /> Not Harder
          </h1>
          <p className="text-xl text-center text-white/80 max-w-md">
            Access thousands of verified study materials from top universities. Your academic success starts here.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            {(forgotPasswordStep || resetPasswordStep) && (
              <button
                onClick={handleBackToLogin}
                className="absolute left-4 top-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            )}

            <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-studyroot-blue to-studyroot-purple p-2 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-studyroot-blue to-studyroot-purple bg-clip-text text-transparent">
                StudyRoot
              </span>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {currentStep === "forgot-password-otp" && "Verify OTP"}
              {currentStep === "reset-password" && "Reset Password"}
              {currentStep === "signup-otp" && "Verify OTP"}
              {currentStep === "login" && "Welcome Back"}
              {currentStep === "signup" && "Join StudyRoot"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {currentStep === "forgot-password-otp" && "Enter the OTP sent to your email"}
              {currentStep === "reset-password" && "Enter your new password"}
              {currentStep === "signup-otp" && "Enter the OTP sent to your email"}
              {currentStep === "login" && "Sign in to access your study materials"}
              {currentStep === "signup" && "Create your account to get started"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Signup Form Fields */}
              {currentStep === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pl-10 h-12 bg-muted"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email and Password Fields (for login, signup, and forgot password) */}
              {(currentStep === "login" || currentStep === "signup") && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="pl-10 h-12 bg-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="pl-10 h-12 bg-muted"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* OTP Field */}
              {(currentStep === "signup-otp" || currentStep === "forgot-password-otp") && (
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="pl-10 h-12 bg-muted"
                    />
                  </div>
                </div>
              )}

              {/* Reset Password Fields */}
              {currentStep === "reset-password" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="pl-10 h-12 bg-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pl-10 h-12 bg-muted"
                      />
                    </div>
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={
                  isSigningUp ||
                  isLoggingIn ||
                  isVerifyingOtp ||
                  isForgotPassword ||
                  isVerifyingPasswordResetOtp ||
                  isResettingPassword
                }
                className={`w-full h-12 bg-gradient-to-r from-studyroot-blue to-studyroot-purple text-white font-medium rounded-xl transition-all duration-300 ${isSigningUp || isLoggingIn || isVerifyingOtp || isForgotPassword || isVerifyingPasswordResetOtp || isResettingPassword
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-studyroot-purple hover:to-studyroot-blue hover:scale-[1.02]"
                  }`}
              >
                {currentStep === "forgot-password-otp" && (isVerifyingPasswordResetOtp ? "Verifying OTP..." : "Verify OTP")}
                {currentStep === "reset-password" && (isResettingPassword ? "Resetting Password..." : "Reset Password")}
                {currentStep === "signup-otp" && (isVerifyingOtp ? "Verifying OTP..." : "Verify OTP")}
                {currentStep === "login" && (isLoggingIn ? "Signing In..." : "Sign In")}
                {currentStep === "signup" && (isSigningUp ? "Creating Account..." : "Create Account")}
              </Button>
            </form>

            {/* Forgot Password Link (only on login) */}
            {currentStep === "login" && (
              <div className="text-center">
                <button
                  onClick={handleForgotPassword}
                  disabled={isForgotPassword}
                  className="text-studyroot-blue hover:underline font-medium disabled:opacity-50"
                >
                  {isForgotPassword ? "Sending..." : "Forgot Password?"}
                </button>
              </div>
            )}

            {/* Toggle between Login and Signup */}
            {!otpStep && !forgotPasswordStep && !resetPasswordStep && (
              <div className="text-center">
                <p className="text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-studyroot-blue hover:underline font-medium"
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            )}

            {currentStep === "signup-otp" && (
              <div className="flex flex-col items-center space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendOtp}
                  disabled={resendDisabled}
                  className="w-full"
                >
                  {resendDisabled ? `Resend OTP (${resendTimer}s)` : "Resend OTP"}
                </Button>
              </div>
            )}
            {currentStep === "forgot-password-otp" && (
              <div className="flex flex-col items-center space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendPasswordResetOtp}
                  disabled={resendDisabled}
                  className="w-full"
                >
                  {resendDisabled ? `Resend OTP (${resendTimer}s)` : "Resend OTP"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
