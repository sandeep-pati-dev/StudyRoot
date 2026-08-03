// components/NoteCard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Edit, Trash2, Download, Calendar, User } from "lucide-react";

const NoteCard = ({ note, onEdit, onDelete }) => {
  const getFileTypeColor = (format: string = "") => {
    switch (format.toUpperCase()) {
      case "PDF": return "border-l-red-500";
      case "DOCX": return "border-l-blue-500";
      case "PPTX": return "border-l-yellow-500";
      default: return "border-l-gray-500";
    }
  };

  const getFileTypeIcon = (format: string = "") => {
    const iconClass = "h-5 w-5 sm:h-6 sm:w-6 text-white";
    return <FileText className={iconClass} />;
  };

  return (
    <Card className={`bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${getFileTypeColor(note.fileFormat)} group`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Main content area */}
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
            <div className="bg-gradient-to-r from-uninote-blue to-uninote-purple p-2 sm:p-3 rounded-lg sm:rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-200">
              {getFileTypeIcon(note.fileFormat)}
            </div>
            <div className="flex-1 min-w-0">
              {/* Title and format badge */}
              <div className="flex items-start justify-between mb-1 sm:mb-2">
                <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 sm:line-clamp-1 pr-2 sm:pr-4 flex-1">{note.title}</h3>
                <span className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded-full shrink-0 ml-2">
                  {note.fileFormat?.toUpperCase() || 'FILE'}
                </span>
              </div>

              {/* Course info */}
              <p className="text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-1">
                {note.subject?.semester?.course?.name}
                <span className="hidden sm:inline"> • Semester {note.subject?.semester?.number} • {note.subject?.name}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2 sm:hidden">
                Semester {note.subject?.semester?.number} • {note.subject?.name}
              </p>

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">
                    <span className="sm:hidden">{note.uploadedBy?.fullName || "Unknown"}</span>
                    <span className="hidden sm:inline">By: {note.uploadedBy?.fullName || "Unknown"}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>
                    <span className="sm:hidden">{note.uploadDate}</span>
                    <span className="hidden sm:inline">On: {note.uploadDate}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{note.downloads} downloads</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2 sm:shrink-0 sm:ml-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-initial border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 text-xs sm:text-sm"
              onClick={() => onEdit(note)}
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(note._id, note.title)}
              className="flex-1 sm:flex-initial border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors duration-200 text-xs sm:text-sm"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;