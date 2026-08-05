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
import { motion } from "framer-motion";

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
      disabled: false,
    },
    {
      title: "AI Summarize",
      description: "Summarize content with AI",
      icon: Cpu,
      onClick: () => navigate("/ai-summarize"),
      disabled: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
     
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {cards.map(({ title, description, icon: Icon, onClick, disabled }) => (
            <motion.div
              key={title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
              }}
            >
              <Card
                className={`group bg-card/80 backdrop-blur-sm border-0 shadow-lg transition-all duration-300 ${
                  disabled
                    ? "cursor-not-allowed"
                    : "hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
                }`}
                onClick={disabled ? undefined : onClick}
              >
                <CardHeader className="text-center pb-4 relative">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-studyroot-blue to-studyroot-purple flex items-center justify-center ${
                    disabled ? "" : "group-hover:scale-110 transition-transform duration-300"
                  }`}>
                    <Icon className="h-8 w-8 text-foreground" />
                  </div>
                  <CardTitle className={`text-2xl font-bold text-foreground ${
                    disabled ? "" : "group-hover:text-studyroot-blue transition-colors"
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
                    className={`w-full bg-gradient-to-r from-studyroot-blue to-studyroot-purple text-white font-medium rounded-xl transition-all duration-300 py-2 ${
                      disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:from-studyroot-purple hover:to-studyroot-blue"
                    }`}
                    disabled={disabled}
                  >
                    {disabled ? "Coming Soon" : "Go"}
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
