import { useEffect, useState } from "react";
import axios from "@/lib/axiosInstance";

export const useNotes = (activeTab: string) => {
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === "manage") {
      const fetchNotes = async () => {
        try {
          const res = await axios.get("/notes");
          setNotes(res.data || []);
        } catch (err) {
          console.error("Error fetching notes", err);
        }
      };
      fetchNotes();
    }
  }, [activeTab]);

  return [notes, setNotes] as const;
};
