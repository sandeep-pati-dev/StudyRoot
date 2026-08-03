import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Code,
  FileText,
  Cpu,
  Home,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Study Materials",
      description: "View all available Study Materials ",
      icon: BookOpen,
      onClick: () => navigate("/courses"),
      disabled: false,
    },
    {
      title: "Collaborative Editor",
      description: "Work together in real-time",
      icon: Code,
      onClick: () => navigate("/collaborative-editor"),
      disabled: true,
    },
    {
      title: "Quiz Generator",
      description: "Create and take quizzes",
      icon: FileText,
      onClick: () => navigate("/generate-mcq"),
      disabled: true,
    },
    {
      title: "AI Summarize",
      description: "Summarize content with AI",
      icon: Cpu,
      onClick: () => navigate("/ai-summarize"),
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
     
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map(({ title, description, icon: Icon, onClick, disabled }) => (
            <Card
              key={title}
              className={`group bg-card/80 backdrop-blur-sm border-0 shadow-lg transition-all duration-300 ${
                disabled
                  ? "cursor-not-allowed"
                  : "hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
              }`}
              onClick={disabled ? undefined : onClick}
            >
              <CardHeader className="text-center pb-4 relative">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-uninote-blue to-uninote-purple flex items-center justify-center ${
                  disabled ? "" : "group-hover:scale-110 transition-transform duration-300"
                }`}>
                  <Icon className="h-8 w-8 text-foreground" />
                </div>
                <CardTitle className={`text-2xl font-bold text-foreground ${
                  disabled ? "" : "group-hover:text-uninote-blue transition-colors"
                }`}>
                  {title}
                </CardTitle>
                <div className="text-sm text-muted-foreground mt-2">
                  {description}
                </div>
                {disabled && (
                  <Badge variant="secondary" className="absolute top-2 right-2">
                    Coming Soon
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="text-center">
                <button
                  className={`w-full bg-gradient-to-r from-uninote-blue to-uninote-purple text-white font-medium rounded-xl transition-all duration-300 py-2 ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:from-uninote-purple hover:to-uninote-blue"
                  }`}
                  disabled={disabled}
                >
                  {disabled ? "Coming Soon" : "Go"}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
