import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const {
    signup,
    login,
    isSigningUp,
    isLoggingIn,
    authUser,
  } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      navigate("/dashboard");
    }
  }, [authUser, navigate]);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      const success = await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      if (success) {
        setFormData({ fullName: "", email: "", password: "" });
        navigate("/dashboard");
      }
    }
  };

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
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-studyroot-blue to-studyroot-purple p-2 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-studyroot-blue to-studyroot-purple bg-clip-text text-transparent">
                StudyRoot
              </span>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {isLogin ? "Welcome Back" : "Join StudyRoot"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLogin ? "Sign in to access your study materials" : "Create your account to get started"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Signup Form Fields */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
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

              {/* Email and Password Fields */}
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

              <Button
                type="submit"
                disabled={isSigningUp || isLoggingIn}
                className={`w-full h-12 bg-gradient-to-r from-studyroot-blue to-studyroot-purple text-white font-medium rounded-xl transition-all duration-300 ${
                  isSigningUp || isLoggingIn
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:from-studyroot-purple hover:to-studyroot-blue hover:scale-[1.02]"
                }`}
              >
                {isLogin ? (isLoggingIn ? "Signing In..." : "Sign In") : (isSigningUp ? "Creating Account..." : "Create Account")}
              </Button>
            </form>

            {/* Toggle between Login and Signup */}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
