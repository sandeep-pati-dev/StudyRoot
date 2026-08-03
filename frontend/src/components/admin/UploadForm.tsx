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
import { Plus, Upload } from "lucide-react";

interface UploadFormProps {
  courses: any[];
  semesters: any[];
  subjects: any[];
  formData: {
    course: string;
    semester: string;
    subject: string;
    title: string;
    file: File | null;
  };
  loading: boolean;
  isSemesterDisabled: boolean;
  isSubjectDisabled: boolean;
  onChange: (field: string, value: string) => void;
  onCourseChange: (courseId: string) => void;
  onSemesterChange: (semesterId: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({
  courses,
  semesters,
  subjects,
  formData,
  loading,
  isSemesterDisabled,
  isSubjectDisabled,
  onChange,
  onCourseChange,
  onSemesterChange,
  onFileChange,
  onSubmit,
}) => {
  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-3xl font-bold text-foreground mb-1">
        Upload <span className="text-uninote-purple">Notes</span>
      </h1>
      <p className="text-muted-foreground mb-6">
        Upload verified study materials for students to access.
      </p>

      <Card className="bg-card shadow-lg rounded-xl border border-muted">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-foreground">
            <Plus className="h-5 w-5" />
            <span>Add New Note</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details below to upload a new study material.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Course</Label>
                <Select value={formData.course} onValueChange={onCourseChange}>
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
                  onValueChange={onSemesterChange}
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
              <Label>Subject</Label>
              <Select
                disabled={isSubjectDisabled}
                value={formData.subject}
                onValueChange={(val) => onChange("subject", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub._id} value={sub.name}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Note Title</Label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => onChange("title", e.target.value)}
                placeholder="Enter descriptive title for the note"
                required
              />
            </div>

            <div className="border border-dashed border-muted-foreground rounded-lg p-6 text-center">
              <Label className="block mb-2">Upload File</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={onFileChange}
                required
                className="file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
              />
              <p className="left-0 mt-2 text-sm text-muted-foreground">
                Supported formats: PDF, DOC, DOCX (Max size: 10MB)
              </p>
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
                  Uploading...
                </span>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Note
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadForm;
