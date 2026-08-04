
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ChevronRight, Home, BookOpen, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import UserDropdown from "@/components/UserDropdown";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "@/lib/axiosInstance"; // or just "axios" if not using custom instance

const SemesterView = () => {
  const { course, semester } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();






  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseName, setCourseName] = useState<string>('');
  const [semesterName, setSemesterName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubjects = subjects.filter((subject: any) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.subjectCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const res = await axios.get(`/courses/${course}`);
        setCourseName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch course name", err);
      }
    };
    if (course) fetchCourseName();
  }, [course]);

  useEffect(() => {
    const fetchSemesterName = async () => {
      try {
        const res = await axios.get(`/semesters/${semester}`);
        setSemesterName(res.data.number);
      } catch (err) {
        console.error("Failed to fetch semester name", err);
      }
    };
    if (semester) fetchSemesterName();
  }, [course]);
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`/subjects/semester/${semester}`);
        setSubjects(res.data);
      } catch (error) {
        console.error("Error fetching subjects", error);
      } finally {
        console.log("Finished fetching subjects");
        setLoading(false);
      }
    };
    if (semester) fetchSubjects();
  }, [semester]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          
          <Link to="/dashboard" className="flex items-center hover:text-uninote-blue transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/courses" className="flex items-center hover:text-uninote-blue transition-colors">
            Study Materials
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={`/dashboard/${course}`} className="hover:text-uninote-blue transition-colors">
            {(courseName)}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">Semester {semesterName}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Semester {semesterName}{" "}
            <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
              Subjects
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Select a subject to access notes and study materials for {courseName} , Semester {semesterName}.
          </p>
        </div>

        {/* Search Input */}
        <div className="flex justify-center mb-10 animate-fade-in">
          <div className="w-full max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search subjects by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-uninote-purple bg-card/50 border-border/50"
            />
          </div>
        </div>

        {/* Subject Cards */}
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
          {filteredSubjects.map((subject) => (
            <motion.div
              key={subject._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
              }}
            >
              <Card
                className="group bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-4px] cursor-pointer"
                onClick={() => navigate(`/dashboard/${course}/${semester}/${subject._id}`)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-uninote-blue to-uninote-purple flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-uninote-blue transition-colors">
                    {subject.name}
                  </CardTitle>
                  <div className="text-sm font-medium text-uninote-purple bg-uninote-purple/10 px-2 py-1 rounded-full inline-block mb-2">
                    Subject Code : {subject.subjectCode}
                  </div>

                  <div className="text-sm text-muted-foreground mt-2">
                    {subject.notes} notes available
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    className="w-full bg-gradient-to-r from-uninote-blue to-uninote-purple hover:from-uninote-purple hover:to-uninote-blue text-white font-medium rounded-xl transition-all duration-300"
                  >
                    View Notes
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SemesterView;
