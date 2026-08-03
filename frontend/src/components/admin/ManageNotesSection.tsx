// components/admin/ManageNotesSection.tsx

import { Card, CardContent } from "@/components/ui/card";
import NoteCard from "./NoteCard";

interface ManageNotesSectionProps {
  notes: any[];
  onEdit: (note: any) => void;
  onDelete: (id: string, title: string) => void;
}

const ManageNotesSection: React.FC<ManageNotesSectionProps> = ({
  notes,
  onEdit,
  onDelete,
}) => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Manage{" "}
          <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
            Notes
          </span>
        </h1>
        <p className="text-muted-foreground">
          View and manage all uploaded study materials.
        </p>
      </div>

      <div className="grid gap-6">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageNotesSection;
