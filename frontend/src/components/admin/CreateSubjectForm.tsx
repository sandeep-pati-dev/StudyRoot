import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Plus } from "lucide-react";

interface Semester {
  _id: string;
  number: number;
}

interface CreateSubjectFormProps {
  courses: any[];
  semesters: Semester[];
  formData: {
    course: string;
    semester: string; // store semester ID
    semesterNumber: string; // store semester number as string
    subjectName: string;
    subjectCode: string;
  };
  loading: boolean;
  isSemesterDisabled: boolean;
  onChange: (field: string, value: string) => void;
  onCourseChange: (courseId: string) => void;
  onSemesterChange: (semesterId: string, semesterNumber: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CreateSubjectForm: React.FC<CreateSubjectFormProps> = ({
  courses,
  semesters,
  formData,
  loading,
  isSemesterDisabled,
  onChange,
  onCourseChange,
  onSemesterChange,
  onSubmit,
}) => {
  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">
        Create <span className="text-uninote-purple">Subject</span>
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Add subjects under selected course and semester.
      </p>

      <Card className="bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
            <BookOpen className="h-5 w-5" />
            <span>Add New Subject</span>
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select course, semester and enter subject name and code.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Course</Label>
                <Select value={formData.course} onValueChange={onCourseChange} className="dark:bg-gray-800 dark:text-gray-100">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Semester</Label>
                <Select
                  disabled={isSemesterDisabled}
                  value={formData.semester}
                  onValueChange={(value) => {
                    const selected = semesters.find((s) => s._id === value);
                    onSemesterChange(value, selected?.number || 0);
                  }}
                  className="dark:bg-gray-800 dark:text-gray-100"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                   
                    
                    {semesters.map((sem) => (
                      <SelectItem key={sem._id} value={sem._id}>
                        Semester {sem.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Subject Name</Label>
              <Input
                type="text"
                value={formData.subjectName}
                onChange={(e) => onChange("subjectName", e.target.value)}
                placeholder="Enter subject name"
                required
                className="dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <Label>Subject Code</Label>
              <Input
                type="text"
                value={formData.subjectCode}
                onChange={(e) => onChange("subjectCode", e.target.value)}
                placeholder="Enter subject code"
                required
                className="dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
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
                  Create Subject
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSubjectForm;
