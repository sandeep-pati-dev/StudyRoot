
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ChevronRight, Home, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import axios from "@/lib/axiosInstance"; // or just "axios" if not using custom instance

const CourseView = () => {
  const { course } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();


  const getCourseName = (courseId: string) => {
    const courseNames: Record<string, string> = {
      'btech': 'B.Tech',
      'mca': 'MCA',
      'bca': 'BCA',
      'mba': 'MBA',
      'others': 'Others'
    };
    return courseNames[courseId] || courseId;
  };


  const [semesters, setSemesters] = useState<{ _id: string, number: number }[]>([]);
  const [courseName, setCourseName] = useState<string>('');

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
    const fetchSemesters = async () => {
      try {
        const res = await axios.get(`/semesters/course/${course}`);
        setSemesters(res.data);
      } catch (err) {
        console.error("Failed to fetch semesters", err);
      }
    };

    if (course) fetchSemesters();
  }, [course]);


  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
         
          <Link to="/dashboard" className="flex items-center hover:text-studyroot-blue transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/courses" className="flex items-center hover:text-studyroot-blue transition-colors">
            Study Materials
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{getCourseName(courseName || '')}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {getCourseName(courseName || '')}{" "}
            <span className="bg-gradient-to-r from-studyroot-blue to-studyroot-purple bg-clip-text text-transparent">
              Semesters
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Select a semester to access subject-wise notes and study materials.
          </p>
        </div>




        {/* Semester Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {semesters.map((semesterData) => (
            <Card
              key={semesterData.number}
              className="group bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-4px] cursor-pointer"
              onClick={() => navigate(`/dashboard/${course}/semester/${semesterData._id}`)}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-studyroot-blue to-studyroot-purple flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-studyroot-blue transition-colors">
                  Semester {semesterData.number}
                </CardTitle>
                <div className="text-sm text-muted-foreground mt-2">
                  Total Subjects:
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={() => navigate(`/dashboard/${course}/semester/${semesterData._id}`)}

                  className="w-full bg-gradient-to-r from-studyroot-blue to-studyroot-purple hover:from-studyroot-purple hover:to-studyroot-blue text-white font-medium rounded-xl transition-all duration-300"
                >
                  View Subjects
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseView;
