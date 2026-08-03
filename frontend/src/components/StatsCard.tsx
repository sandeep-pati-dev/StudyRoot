import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Download, GraduationCap } from "lucide-react";
import axios from "@/lib/axiosInstance";
import LoadingScreen from "./ui/LoadingScreen";

const StatsCard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalNotes: 0,
    totalDownloads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/dashboard/stats");
        setStats({
          totalCourses: response.data.totalCourses,
          totalNotes: response.data.totalNotes,
          totalDownloads: response.data.totalDownloads,
        });
      } catch (err) {
        setError("Failed to load stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">{error}</div>;
  }

  const statsData = [
    {
      label: "Total Courses",
      value: stats.totalCourses.toLocaleString(),
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Notes Available",
      value: stats.totalNotes.toLocaleString(),
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Total Downloads",
      value: stats.totalDownloads.toLocaleString(),
      icon: Download,
      color: "from-green-500 to-teal-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card
            key={index}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-6 text-center">
              <div
                className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}
              >
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCard;
