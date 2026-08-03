import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Upload, FileText } from "lucide-react";
import axios from "@/lib/axiosInstance";
import { useToast } from "@/hooks/use-toast";

interface EditNoteModalProps {
  note: any;
  onClose: () => void;
  onUpdate: (updatedNote: any) => void;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({ note, onClose, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0); // Key to reset file input
  const { toast } = useToast();

  // Initialize form with existing note data
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
    }
  }, [note]);

  // Check for changes to enable/disable save button
  useEffect(() => {
    const titleChanged = title !== (note?.title || "");
    const fileChanged = file !== null;
    setHasChanges(titleChanged || fileChanged);
  }, [title, file, note]);

  const handleUpdate = async () => {
    if (!hasChanges) return;

    setIsLoading(true);
    try {
      const form = new FormData();
      form.append("title", title.trim());
      if (file) {
        form.append("file", file);
      }

      const res = await axios.put(`/notes/update/${note._id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUpdate(res.data.note);

      toast({
        title: "Success",
        description: "Note updated successfully",
        className: "bg-green-50 border-green-200"
      });
      onClose();
    } catch (err: any) {
      console.error("Update failed", err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to update note",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setFileInputKey(prev => prev + 1); // Reset file input by changing key
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Edit Note</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Note Title
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              className="w-full h-12 px-4 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 text-foreground"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              Update File (Optional)
            </label>

            {/* Current File Info */}
            {note?.filename && !file && (
              <div className="p-4 bg-muted rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate">
                    Current: {note.filename}
                  </span>
                </div>
              </div>
            )}

            {/* New File Selected */}
            {file && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-800 truncate">
                      {file.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="w-6 h-6 p-0 hover:bg-blue-100 rounded-full ml-2"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* File Input */}
            <div className="relative">
              <Input
                key={fileInputKey} // This will reset the input when key changes
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileChange}
                className="w-full h-12 px-4 border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-blue-500 file:to-purple-500 file:text-white hover:file:from-blue-600 hover:file:to-purple-600"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOC, DOCX, PPT, PPTX
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 p-6 pt-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto h-12 px-6 border-gray-200 hover:bg-gray-50 text-muted-foreground rounded-xl font-medium"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={!hasChanges || isLoading || !title.trim()}
            className={`w-full sm:w-auto h-12 px-8 rounded-xl font-medium transition-all duration-200 ${hasChanges && title.trim() && !isLoading
                ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-200 text-muted-foreground cursor-not-allowed"
              }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditNoteModal;