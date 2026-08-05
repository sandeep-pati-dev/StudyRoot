import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, BookOpen, Users, Award, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = (clientX - centerX) / 25;
      const offsetY = (clientY - centerY) / 25;
      setMousePos({ x: offsetX, y: offsetY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="min-h-screen bg-background relative overflow-hidden">
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      >
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-tr from-studyroot-blue to-studyroot-purple rounded-full opacity-40 mix-blend-multiply filter blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-32 w-[28rem] h-[28rem] bg-gradient-to-r from-pink-300 to-studyroot-purple rounded-full opacity-40 mix-blend-multiply filter blur-2xl animate-bounce-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-blue-300 to-studyroot-blue rounded-full opacity-40 mix-blend-multiply filter blur-3xl animate-float delay-300"></div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-300"
        style={{ transform: `translate(${mousePos.x / 2}px, ${mousePos.y / 2}px)` }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.2" />
            </pattern>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" stroke="url(#gridGradient)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
              All Your University Notes, {" "}
              <span className="bg-gradient-to-r from-studyroot-blue to-studyroot-purple bg-clip-text text-transparent">
                One Click Away
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0">
              StudyRoot makes accessing semester-wise, subject-wise notes easier than ever. From B.Tech to MBA – get what you need, when you need it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-studyroot-blue to-studyroot-purple text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-studyroot-blue text-studyroot-blue hover:bg-studyroot-blue hover:text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5" /> Learn More
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
              {[
                { stat: "10K+", label: "Students", color: "text-studyroot-blue" },
                { stat: "500+", label: "Notes", color: "text-studyroot-purple" },
                { stat: "50+", label: "Subjects", color: "text-studyroot-blue" },
              ].map(({ stat, label, color }, idx) => (
                <div key={idx} className="text-center">
                  <div className={`text-3xl font-bold ${color} mb-1`}>{stat}</div>
                  <div className="text-muted-foreground text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-slide-in-right">
            <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20 hover:rotate-1 transition-transform duration-500">
              <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-studyroot-blue to-studyroot-purple p-4 text-white">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-semibold mt-4">StudyRoot Dashboard</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border">
                      <BookOpen className="h-8 w-8 text-studyroot-blue mb-2" />
                      <div className="text-sm font-semibold text-foreground">B.Tech</div>
                      <div className="text-xs text-muted-foreground">Engineering</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border">
                      <Users className="h-8 w-8 text-studyroot-purple mb-2" />
                      <div className="text-sm font-semibold text-foreground">MCA</div>
                      <div className="text-xs text-muted-foreground">Computer Apps</div>
                    </div>
                  </div>
                  {["Data Structures", "Database Systems", "Operating Systems"].map((subject, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border"
                    >
                      <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-studyroot-blue" : i === 1 ? "bg-studyroot-purple" : "bg-green-500"}`}></div>
                      <span className="text-sm text-foreground">{subject}</span>
                      <div className="ml-auto text-xs text-muted-foreground">PDF</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-card/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/30 animate-float">
              <Award className="h-8 w-8 text-studyroot-blue" />
            </div>
            <div
              className="absolute -bottom-4 -left-4 bg-card/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/30 animate-float delay-1000"
            >
              <Shield className="h-8 w-8 text-studyroot-purple" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;