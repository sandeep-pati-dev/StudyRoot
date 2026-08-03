// src/components/admin/SidebarNav.tsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  LogOut,
  Upload,
  Users,
  Menu,
  X,
  ChevronRight,
  UserCog,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SidebarNav = ({ activeTab, setActiveTab }: SidebarNavProps) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close mobile sidebar when clicking outside or on navigation
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const menuButton = document.getElementById("menu-button");

      if (
        isMobileOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        !menuButton?.contains(event.target as Node)
      ) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileOpen(false); // Close mobile sidebar after selection
  };

  const handleDashboardNavigation = () => {
    navigate("/dashboard");
    setIsMobileOpen(false);
  };

  const navigationItems = [
    {
    id: "createCourse",
    label: "Create Course",
    icon: GraduationCap,
    onClick: () => handleTabChange("createCourse"),
  },
  {
    id: "createSubject",
    label: "Create Subject",
    icon: BookOpen,
    onClick: () => handleTabChange("createSubject"),
  },
    {
      id: "upload",
      label: "Upload Notes",
      icon: Upload,
      onClick: () => handleTabChange("upload"),
    },
    {
      id: "manage",
      label: "Manage Notes",
      icon: BookOpen,
      onClick: () => handleTabChange("manage"),
    },
    {
      id: "users",
      label: "Manage Users",
      icon: UserCog,
      onClick: () => handleTabChange("users"),
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Users,
      onClick: handleDashboardNavigation,
    },
  ];

  return (
    <>
      {/* Menu Button - Always visible on mobile, toggles sidebar */}
      <button
        id="menu-button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-card/95 backdrop-blur-sm border border-gray-200/50 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isMobileOpen ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-200"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          ${isCollapsed ? "w-20" : "w-64"}
          bg-card/95 backdrop-blur-xl border-r border-gray-200/50
          transform transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shadow-2xl lg:shadow-none
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100/50">
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-3 transition-all duration-200 ${isCollapsed ? "justify-center" : ""}`}>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2.5 rounded-xl shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                {!isCollapsed && (
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    UniNote
                  </span>
                )}
              </div>

              {/* Collapse Button - Desktop only */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:block p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isCollapsed ? "rotate-0" : "rotate-180"}`} />
              </button>
            </div>

            {/* Admin Badge */}
            {!isCollapsed && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-xl p-3 sm:p-4 mt-4 sm:mt-6 shadow-sm">
                <p className="text-sm text-yellow-800 font-semibold flex items-center">
                  🔒 Admin Panel
                </p>
                <p className="text-xs text-yellow-700/80 mt-1">Administrative access only</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`
                    group relative w-full flex items-center space-x-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl 
                    transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                    ${isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-foreground hover:bg-muted hover:text-foreground"
                    }
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-600 group-hover:text-gray-700"} transition-colors`} />
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}

                  {/* Active Indicator */}
                  {isActive && !isCollapsed && (
                    <div className="absolute right-3 w-2 h-2 bg-white rounded-full opacity-80" />
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-r-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-3 sm:p-4 border-t border-gray-100/50">
            <Button
              variant="outline"
              onClick={handleLogout}
              className={`
                w-full group border-red-200/50 text-red-600 hover:bg-red-50/80 hover:border-red-300 
                transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] h-12 sm:h-auto
                ${isCollapsed ? "px-0" : "px-3 sm:px-4"}
              `}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2 font-medium">Logout</span>}

              {/* Tooltip for collapsed logout */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  Logout
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-r-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarNav;