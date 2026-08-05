import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["features", "about"];
      let currentSection = "";

      for (const id of sections) {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom >= 80) {
            currentSection = id;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-gray-300/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-studyroot-blue to-studyroot-purple p-2 rounded-xl shadow-md">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-studyroot-blue to-studyroot-purple bg-clip-text text-transparent">
              StudyRoot
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className={`font-medium transition-all border-b-2 pb-1 ${activeSection === "features"
                  ? "text-studyroot-blue border-studyroot-blue"
                  : "text-muted-foreground border-transparent hover:text-studyroot-blue"
                }`}
            >
              Features
            </a>
            <a
              href="#about"
              className={`font-medium transition-all border-b-2 pb-1 ${activeSection === "about"
                  ? "text-studyroot-purple border-studyroot-purple"
                  : "text-muted-foreground border-transparent hover:text-studyroot-purple"
                }`}
            >
              About
            </a>
            <Link to="/auth">
              <Button
                variant="outline"
                className="border-2 border-studyroot-blue text-studyroot-blue hover:bg-studyroot-blue hover:text-white rounded-xl"
              >
                Login
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-studyroot-blue to-studyroot-purple hover:from-studyroot-purple hover:to-studyroot-blue text-white font-semibold rounded-xl">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground hover:text-studyroot-purple transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 py-4 bg-background/80 backdrop-blur-lg rounded-b-xl shadow-md">
            <div className="flex flex-col space-y-4">
              <a href="#features" className={`font-medium px-4 ${activeSection === "features"
                  ? "text-studyroot-blue underline"
                  : "text-muted-foreground hover:text-studyroot-blue"
                }`}>
                Features
              </a>
              <a href="#about" className={`font-medium px-4 ${activeSection === "about"
                  ? "text-studyroot-purple underline"
                  : "text-muted-foreground hover:text-studyroot-purple"
                }`}>
                About
              </a>
              <div className="flex flex-col space-y-2 px-4">
                <Link to="/auth">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-studyroot-blue text-studyroot-blue hover:bg-studyroot-blue hover:text-white rounded-xl"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="w-full bg-gradient-to-r from-studyroot-blue to-studyroot-purple hover:from-studyroot-purple hover:to-studyroot-blue text-white font-semibold rounded-xl">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;