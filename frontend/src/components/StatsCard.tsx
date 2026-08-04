import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Download, GraduationCap } from "lucide-react";
import axios from "@/lib/axiosInstance";

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
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-pulse">
        {[1, 2, 3].map((index) => (
          <Card key={index} className="bg-card/40 backdrop-blur-md border border-border/40 rounded-2xl shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-muted" />
              <div className="h-8 w-16 mx-auto bg-muted rounded mb-2" />
              <div className="h-4 w-28 mx-auto bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
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
      shadow: "shadow-blue-500/10",
    },
    {
      label: "Total Notes Available",
      value: stats.totalNotes.toLocaleString(),
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/10",
    },
    {
      label: "Total Downloads",
      value: stats.totalDownloads.toLocaleString(),
      icon: Download,
      color: "from-green-500 to-teal-500",
      shadow: "shadow-green-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card
            key={index}
            className={`group bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg hover:shadow-xl ${stat.shadow} transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1`}
          >
            <CardContent className="p-6 text-center">
              <div
                className={`w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div className="text-4.5xl font-extrabold text-foreground mb-1 tracking-tight">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">{stat.label}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCard;
