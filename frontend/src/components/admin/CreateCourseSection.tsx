import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GraduationCap, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axiosInstance";

const CreateCourseSection = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [semesters, setSemesters] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !semesters) {
      return toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
    }

    try {
      setLoading(true);
      await axios.post("/courses", {
        name,
        totalSemesters: Number(semesters),
      });

      toast({
        title: "Success",
        description: "Course created successfully!",
      });

      setName("");
      setSemesters("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">
        Create <span className="text-studyroot-purple">Course</span>
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Add a new course and define its total number of semesters.
      </p>

      <Card className="bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
            <GraduationCap className="h-5 w-5" />
            <span>Add New Course</span>
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter course name and number of semesters.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Course Name</Label>
              <Input
                type="text"
                placeholder="e.g. B.Tech (CSE)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <Label>Total Semesters</Label>
              <Input
                type="number"
                min={1}
                max={12}
                placeholder="e.g. 8"
                value={semesters}
                onChange={(e) => setSemesters(e.target.value)}
                required
                className="dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCourseSection;
