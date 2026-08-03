import { Link } from "react-router-dom";
import { GraduationCap, Moon, Sun } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import UserDropdown from "@/components/UserDropdown";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  if (!authUser) return null;

  return (
    <nav className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        {/* Gradient background with glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-800/20 backdrop-blur-xl border border-white/20 rounded-2xl"></div>

        {/* Secondary glass layer for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-2xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
            {/* Logo Section */}
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 sm:space-x-3 group transition-all duration-300 hover:scale-105"
            >
              {/* Logo background with enhanced gradient */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 p-2 sm:p-2.5 lg:p-3 rounded-xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white drop-shadow-lg" />
                </div>
              </div>

              {/* Brand text with responsive sizing */}
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-purple-700 transition-all duration-300 drop-shadow-sm">
                StudyRoot
              </span>
            </Link>

            {/* User Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-gray-300 bg-white/30 dark:bg-gray-900/40 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
                aria-label="Toggle dark mode"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-foreground" />
                )}
              </button>
              {/* Glassmorphism wrapper for user dropdown */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-sm"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300">
                  <UserDropdown
                    userName={authUser.fullName}
                    userImage={authUser.profilePic}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle bottom glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      </div>
    </nav>
  );
};

export default Navbar;