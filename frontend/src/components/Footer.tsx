import { useEffect, useState } from "react";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = (e.clientX - centerX) / 40;
      const offsetY = (e.clientY - centerY) / 40;
      setMousePos({ x: offsetX, y: offsetY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <footer className="relative bg-background text-foreground overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 transition-transform duration-200 pointer-events-none"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      >
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-studyroot-blue to-studyroot-purple rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-studyroot-purple to-pink-300 rounded-full filter blur-3xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/10 rounded-full filter blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Hover Effects on Specific Values */}
        <div className="absolute top-[20%] left-[10%] w-60 h-60 bg-white/5 rounded-full blur-3xl hover:scale-105 transition-transform duration-500"></div>
        <div className="absolute top-[40%] left-[55%] w-72 h-72 bg-white/5 rounded-full blur-3xl hover:scale-105 transition-transform duration-500"></div>
        <div className="absolute top-[65%] left-[15%] w-48 h-48 bg-white/5 rounded-full blur-3xl hover:scale-105 transition-transform duration-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-studyroot-blue to-studyroot-purple p-2 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-studyroot-blue to-studyroot-purple bg-clip-text text-transparent">
                StudyRoot
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your one-stop hub for university notes and study materials.
              Helping students excel in their academic journey.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="/auth" className="text-muted-foreground hover:text-foreground transition-colors">Courses</a></li>
            </ul>
          </div>

          {/* Legal */}


          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-studyroot-blue" />
                <span className="text-muted-foreground">studyroot18@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-studyroot-blue" />
                <span className="text-muted-foreground">+91 7606957399</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-studyroot-blue" />
                <span className="text-muted-foreground">GIET University ,GUNUPUR</span>
              </div>
            </div>
          </div>

        </div>

        {/* Developer Info Section */}


        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 StudyRoot. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
