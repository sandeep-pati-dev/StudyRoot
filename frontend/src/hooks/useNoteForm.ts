import { useState } from "react";

export const useNoteForm = () => {
  const [formData, setFormData] = useState({
    course: "",
    semester: "",
    subject: "",
    title: "",
    file: null as File | null,
  });

  const [isSemesterDisabled, setIsSemesterDisabled] = useState(true);
  const [isSubjectDisabled, setIsSubjectDisabled] = useState(true);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      course: "",
      semester: "",
      subject: "",
      title: "",
      file: null,
    });
    setIsSemesterDisabled(true);
    setIsSubjectDisabled(true);
  };

  return {
    formData,
    isSemesterDisabled,
    isSubjectDisabled,
    handleInputChange,
    resetForm,
    setIsSemesterDisabled,
    setIsSubjectDisabled,
    setFormData,
  };
};
