import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  BookOpen,
  Code,
  Building,
  Briefcase,
  MoreHorizontal,
  Search,
  ChevronRight,
  Home,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import Navbar from "@/components/Navbar";
import axios from "@/lib/axiosInstance";

// Meta map to assign icons & colors based on course name
const courseMeta = {
  "B.Tech": { icon: Code, color: "from-blue-500 to-cyan-500" },
  MCA: { icon: BookOpen, color: "from-purple-500 to-pink-500" },
  BCA: { icon: Building, color: "from-green-500 to-teal-500" },
  MBA: { icon: Briefcase, color: "from-orange-500 to-red-500" },
  others: { icon: MoreHorizontal, color: "from-gray-500 to-slate-500" },
};

const Courses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await axios.get("/courses");
        setCourses(response.data);
      } catch (err) {
        setError("Failed to load courses");
        console.error(err);
      }
    };

    getCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return <div className="text-center text-red-500 py-12">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
         
          <Link to="/dashboard" className="flex items-center hover:text-studyroot-blue transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">Study Materials</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome to Your{" "}
            <span className="bg-gradient-to-r from-studyroot-blue to-studyroot-purple bg-clip-text text-transparent">
              Study Hub
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose your course to access semester-wise notes and study
            materials. Everything you need for academic success, organized and
            ready to download.
          </p>
        </div>

        {/* Search Input */}
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-studyroot-purple"
            />
          </div>
        </div>

        {/* Course Cards */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCourses.map((course) => {
            const metaKey = Object.keys(courseMeta).find(key => course.name.startsWith(key));

            const meta = courseMeta[metaKey] || courseMeta.others;
            const IconComponent = meta.icon || GraduationCap;
            const color = meta.color || "from-gray-500 to-slate-500";

            return (
              <motion.div
                key={course._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
                }}
              >
                <Card
                  className="group bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  onClick={() => navigate(`/dashboard/${course._id}`)}
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="h-8 w-8 text-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-studyroot-blue transition-colors">
                      {course.name}
                    </CardTitle>

                    <div className="text-sm text-muted-foreground mt-2">
                      {course.totalSemesters} Semesters
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button className="w-full bg-gradient-to-r from-studyroot-blue to-studyroot-purple hover:from-studyroot-purple hover:to-studyroot-blue text-white font-medium rounded-xl transition-all duration-300">
                      View Semesters
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats */}
        <StatsCard />
      </div>
    </div>
  );
};

export default Courses;
