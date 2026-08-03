import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserDropdownProps {
  userName: string;
  userImage?: string;
}

const UserDropdown = ({ userName, userImage }: UserDropdownProps) => {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("authUser");
      navigate("/");
    } catch (err: any) {
      console.error("Logout Error ❌", err.response?.data?.message || err.message);
      alert("Something went wrong while logging out.");
    }
  };

  const handleAdminRedirect = () => {
    navigate("/admin");
  };

  // Get user initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group relative flex items-center space-x-2 sm:space-x-3 h-auto p-2 sm:p-2.5 lg:p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
        >
          {/* Avatar with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
            <Avatar className="relative h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
              <AvatarImage
                src={userImage}
                alt={userName}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white text-xs sm:text-sm font-semibold">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User name with responsive visibility - hidden on small screens */}
          <div className="hidden sm:flex flex-col items-start min-w-0 flex-1">
            <span className="text-foreground font-medium text-sm lg:text-base truncate max-w-[120px] lg:max-w-[150px] group-hover:text-foreground transition-colors duration-300">
              {userName}
            </span>
            <span className="text-muted-foreground text-xs hidden lg:block">
              {authUser?.role === "admin" ? "Administrator" : "Student"}
            </span>
          </div>

          {/* Chevron indicator - hidden on small screens */}
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-white/60 group-hover:text-white/80 transition-all duration-300 group-data-[state=open]:rotate-180 hidden sm:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 sm:w-56 lg:w-64 bg-card backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-2 mt-2"
        sideOffset={8}
      >
        {/* User info header - visible on smaller screens */}
        <div className="block sm:hidden px-3 py-2 border-b border-white/20 mb-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground">
                {authUser?.role === "admin" ? "Administrator" : "Student"}
              </p>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="flex items-center space-x-3 px-3 py-2.5 hover:bg-muted rounded-xl transition-all duration-200 cursor-pointer group"
        >
          <div className="p-1.5 bg-blue-100/50 rounded-lg group-hover:bg-blue-200/50 transition-colors duration-200">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-foreground font-medium">Profile</span>
        </DropdownMenuItem>

        {/* Conditionally show Admin option */}
        {authUser?.role === "admin" && (
          <DropdownMenuItem
            onClick={handleAdminRedirect}
            className="flex items-center space-x-3 px-3 py-2.5 hover:bg-accent rounded-xl transition-all duration-200 cursor-pointer group"
          >
            <div className="p-1.5 bg-purple-100/50 rounded-lg group-hover:bg-purple-200/50 transition-colors duration-200">
              <Settings className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-primary font-medium">Admin Panel</span>
          </DropdownMenuItem>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2.5 hover:bg-destructive rounded-xl transition-all duration-200 cursor-pointer group"
        >
          <div className="p-1.5 bg-red-100/50 rounded-lg group-hover:bg-red-200/50 transition-colors duration-200">
            <LogOut className="h-4 w-4 text-red-600" />
          </div>
          <span className="text-destructive font-medium">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;