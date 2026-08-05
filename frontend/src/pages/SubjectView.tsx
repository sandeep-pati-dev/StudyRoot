import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  GraduationCap, ChevronRight, Home, Download,
  FileText, Search, BookOpen, Eye, Calendar, User,
  Trash2, Heart, MessageCircle
} from "lucide-react";
import StarRating from "@/components/StarRating";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "@/lib/axiosInstance";
import { formatDistanceToNow } from "date-fns";
import InteractiveStarRating from "@/components/InteractiveStarRating";

const SubjectView = () => {
  const { course, semester, subject } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [courseName, setCourseName] = useState<string>('');
  const [semesterName, setSemesterName] = useState<string>('');
  const [subjectName, setSubjectName] = useState<string>('');
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});

  // New state for comments
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [errorComments, setErrorComments] = useState<string | null>(null);

  // Loading states for post and delete buttons
  const [postingComment, setPostingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  // Pagination state for comments
  const [commentsPage, setCommentsPage] = useState(1);
  const commentsLimit = 5;
  const [totalComments, setTotalComments] = useState(0);
  const totalPages = Math.ceil(totalComments / commentsLimit);

  // State for comments dropdown visibility
  const [commentsVisible, setCommentsVisible] = useState(false);

  // Helper functions for preview and download
  const isPreviewSupported = (format: string) => {
    if (!format) return false;
    const lowerFormat = format.toLowerCase();
    return ["pdf", "docx", "doc", "pptx", "ppt"].includes(lowerFormat);
  };

  const handleDownload = async (noteId: string, title: string, format: string) => {
    toast.info("Preparing download...");
    try {
      const response = await axios.get(`/notes/download/${noteId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Download started!");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Download failed. The file may not be available.");
    }
  };

  // 🛠 Fetch uploader names only once per user
  useEffect(() => {
    const fetchUserNames = async () => {
      const uniqueUserIds = new Set(notes.map(note => note.uploadedBy?._id).filter(Boolean));
      for (const userId of uniqueUserIds) {
        if (!userNames[userId]) {
          try {
            const res = await axios.get(`/notes/name/${userId}`);
            setUserNames(prev => ({ ...prev, [userId]: res.data.fullName }));
          } catch (error) {
            console.error("Failed to fetch user name:", error);
          }
        }
      }
    };

    if (notes.length > 0) fetchUserNames();
  }, [notes]);

  // 🧠 Fetch subject name
  useEffect(() => {
    const fetchSubjectName = async () => {
      try {
        const res = await axios.get(`/subjects/${subject}`);
        setSubjectName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch subject name", err);
      }
    };
    if (subject) fetchSubjectName();
  }, [subject]);

  // 📘 Fetch course name
  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const res = await axios.get(`/courses/${course}`);
        setCourseName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch course name", err);
      }
    };
    if (course) fetchCourseName();
  }, [course]);

  // 📚 Fetch semester number
  useEffect(() => {
    const fetchSemesterName = async () => {
      try {
        const res = await axios.get(`/semesters/${semester}`);
        setSemesterName(res.data.number);
      } catch (err) {
        console.error("Failed to fetch semester name", err);
      }
    };
    if (semester) fetchSemesterName();
  }, [semester]);

  // 📄 Fetch all notes
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/notes/subject/${subject}`);
        setNotes(res.data);
      } catch (err) {
        console.error("Failed to fetch notes", err);
        setError("Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    };

    if (subject) fetchNotes();
  }, [subject]);

  // 📝 Fetch comments for subject and semester with pagination
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const skip = (commentsPage - 1) * commentsLimit;
        const res = await axios.get(`/comments/${subject}/${semester}?skip=${skip}&limit=${commentsLimit}`);
        // Transform likes array to likes count
        const commentsWithLikesCount = res.data.comments.map((comment: any) => {
          const likesCount = Array.isArray(comment.likes) ? comment.likes.length : comment.likes;
          const likedByUser = authUser ? comment.likes.some((id: string) => id === authUser._id) : false;
          return {
            ...comment,
            likes: likesCount,
            likedByUser,
          };
        });
        setComments(commentsWithLikesCount);
        setTotalComments(res.data.totalComments);
        setErrorComments(null);
      } catch (err) {
        console.error("Failed to fetch comments", err);
        setErrorComments("Failed to fetch comments");
      } finally {
        setLoadingComments(false);
      }
    };
    if (subject && semester) fetchComments();
  }, [subject, semester, commentsPage]);

  // Post a new comment
  const handlePostComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    if (!authUser) {
      toast.error("You must be logged in to post comments");
      return;
    }
    try {
      setPostingComment(true);
      await axios.post("/comments", {
        subject,
        semester,
        content: newComment.trim(),
      });
      setNewComment("");
      toast.success("Comment posted");
      // Refetch comments to get populated user data
      const skip = (commentsPage - 1) * commentsLimit;
      const res = await axios.get(`/comments/${subject}/${semester}?skip=${skip}&limit=${commentsLimit}`);
      // Transform likes array to likes count
      const commentsWithLikesCount = res.data.comments.map((comment: any) => ({
        ...comment,
        likes: Array.isArray(comment.likes) ? comment.likes.length : comment.likes,
      }));
      setComments(commentsWithLikesCount);
      setTotalComments(res.data.totalComments);
    } catch (err) {
      console.error("Failed to post comment", err);
      toast.error("Failed to post comment");
    } finally {
      setPostingComment(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      setDeletingCommentId(commentId);
      await axios.delete(`/comments/${commentId}`);
      toast.success("Comment deleted");
      // Refetch comments for current page after deletion
      const skip = (commentsPage - 1) * commentsLimit;
      const res = await axios.get(`/comments/${subject}/${semester}?skip=${skip}&limit=${commentsLimit}`);
      const commentsWithLikesCount = res.data.comments.map((comment: any) => ({
        ...comment,
        likes: Array.isArray(comment.likes) ? comment.likes.length : comment.likes,
      }));
      setComments(commentsWithLikesCount);
      setTotalComments(res.data.totalComments);
    } catch (err) {
      console.error("Failed to delete comment", err);
      toast.error("Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Like a comment with toggle and color change
  const handleLikeComment = async (commentId: string) => {
    try {
      const res = await axios.post(`/comments/${commentId}/like`);
      setComments(prev =>
        prev.map(c =>
          c._id === commentId
            ? { ...c, likes: res.data.likes, likedByUser: res.data.likedByUser }
            : c
        )
      );
    } catch (err) {
      console.error("Failed to like comment", err);
      toast.error("Failed to like comment");
    }
  };

  const getFileTypeColor = (format: string = "") => {
    switch (format.toUpperCase()) {
      case "PDF": return "border-l-red-500";
      case "DOCX": return "border-l-blue-500";
      case "PPTX": return "border-l-yellow-500";
      default: return "border-l-gray-500";
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (note: any) => {
    if (!note.fileUrl) {
      toast.error("File URL not found. Cannot view note.");
      console.error("Missing fileUrl for note:", note);
      return;
    }

    const fileFormat = note.fileFormat?.toLowerCase();
    let viewerUrl = "";

    if (fileFormat === "pdf") {
      viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(note.fileUrl)}&embedded=true`;
    } else if (["docx", "doc", "pptx", "ppt", "xlsx"].includes(fileFormat)) {
      viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(note.fileUrl)}`;
    } else {
      toast.error("Preview not supported for this file type.");
      return;
    }

    window.open(viewerUrl, "_blank");

    // Increment view count
    axios.get(`/notes/view/${note._id}`)
      .then(res => console.log(res.data.message))
      .catch(err => {
        console.error("Failed to update view count:", err);
      });
  };

  const [noteRatings, setNoteRatings] = useState<{ [noteId: string]: { averageRating: number; totalRatings: number } }>({});
  const [userNoteRatings, setUserNoteRatings] = useState<{ [noteId: string]: number }>({});
  const [ratingLoading, setRatingLoading] = useState<{ [noteId: string]: boolean }>({});

  // Fetch ratings for notes after notes are loaded
  useEffect(() => {
    const fetchRatings = async () => {
      const ratings: { [noteId: string]: { averageRating: number; totalRatings: number } } = {};
      const userRatings: { [noteId: string]: number } = {};
      await Promise.all(
        notes.map(async (note) => {
          try {
            const avgRes = await axios.get(`/note-ratings/note/${note._id}`);
            ratings[note._id] = {
              averageRating: avgRes.data.averageRating || 0,
              totalRatings: avgRes.data.totalRatings || 0,
            };
          } catch {
            ratings[note._id] = { averageRating: 0, totalRatings: 0 };
          }
          if (authUser) {
            try {
              const userRes = await axios.get(`/note-ratings/note/${note._id}/user`);
              userRatings[note._id] = userRes.data.rating || 0;
            } catch {
              userRatings[note._id] = 0;
            }
          }
        })
      );
      setNoteRatings(ratings);
      setUserNoteRatings(userRatings);
    };
    if (notes.length > 0) fetchRatings();
  }, [notes, authUser]);

  const handleNoteRatingChange = async (noteId: string, rating: number) => {
    if (!authUser) {
      toast.error("Please log in to rate notes.");
      return;
    }
    setRatingLoading((prev) => ({ ...prev, [noteId]: true }));
    try {
      await axios.post(`/note-ratings/note/${noteId}`, { rating });
      setUserNoteRatings((prev) => ({ ...prev, [noteId]: rating }));
      // Refetch average rating
      const avgRes = await axios.get(`/note-ratings/note/${noteId}`);
      setNoteRatings((prev) => ({
        ...prev,
        [noteId]: {
          averageRating: avgRes.data.averageRating || 0,
          totalRatings: avgRes.data.totalRatings || 0,
        },
      }));
      toast.success("Rating submitted!");
    } catch (err) {
      toast.error("Failed to submit rating.");
    } finally {
      setRatingLoading((prev) => ({ ...prev, [noteId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Breadcrumbs - Mobile Responsive */}
      <br />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground overflow-x-auto">
          <Link to="/dashboard" className="flex items-center hover:text-primary whitespace-nowrap">
            <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Home</span>
          </Link>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <Link to="/courses" className="flex items-center hover:text-primary whitespace-nowrap">
            Study Materials
          </Link>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <Link to={`/dashboard/${course}`} className="hover:text-primary truncate max-w-[80px] sm:max-w-none">
            {courseName}
          </Link>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <Link to={`/dashboard/${course}/semester/${semester}`} className="hover:text-primary whitespace-nowrap">
            <span className="hidden sm:inline">Semester {semesterName}</span>
            <span className="sm:hidden">S{semesterName}</span>
          </Link>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="font-medium text-foreground dark:text-foreground truncate">{subjectName}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-8 sm:pb-12">
        {/* Header - Mobile Responsive */}
        <div className="text-center mb-6 sm:mb-8 px-2 sm:px-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 break-words dark:text-foreground">
            {subjectName} <span className="bg-gradient-to-r from-studyroot-blue to-studyroot-purple bg-clip-text text-transparent">Notes</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0 dark:text-muted-foreground">
            Download verified study materials and notes for {subjectName}.
          </p>
        </div>

        {/* Search - Mobile Responsive */}
        <div className="max-w-md mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground dark:text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search notes..."
              className="pl-10 h-10 sm:h-12 bg-background border-border focus:border-primary rounded-xl text-sm sm:text-base dark:bg-background dark:border-foreground dark:focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading & Error */}
        {
          loading && (
            <div className="text-center text-gray-500 py-6 sm:py-10 text-sm sm:text-base">Loading notes...</div>
          )
        }
        {
          error && (
            <div className="text-center text-red-500 py-4 sm:py-6 text-sm sm:text-base px-4">{error}</div>
          )
        }

        {/* Notes - Mobile Responsive */}
        {
          !loading && !error && filteredNotes.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {filteredNotes.map((note) => (
                <Card
                  key={note._id}
                  className={`bg-card/80 backdrop-blur-sm border-l-4 ${getFileTypeColor(note.fileFormat)} shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]`}
                >
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="bg-gradient-to-r from-studyroot-blue to-studyroot-purple p-2 rounded-lg">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-foreground mb-2 break-words">{note.title}</h3>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
                            <span className="bg-muted px-2 py-1 rounded-full font-medium">
                              {note.fileFormat}
                            </span>
                            <span className="bg-muted px-2 py-1 rounded-full">{note.fileSize}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span className="truncate max-w-[120px]">{userNames[note.uploadedBy?._id] || "Unknown"}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{note.uploadDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Action Buttons */}
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <div className="relative group flex-1">
                            <Button
                              onClick={() => isPreviewSupported(note.fileFormat) && handleView(note)}
                              variant="outline"
                              size="sm"
                              disabled={!isPreviewSupported(note.fileFormat)}
                              className={`w-full flex items-center justify-center space-x-1 border-studyroot-blue text-studyroot-blue text-xs
                              ${isPreviewSupported(note.fileFormat) ? 'hover:bg-studyroot-blue hover:text-white' : 'cursor-not-allowed opacity-50'}`}
                            >
                              <Eye className="h-3 w-3" />
                              <span>View</span>
                            </Button>
                          </div>

                          <div className="flex-1">
                            <Button
                              onClick={() => handleDownload(note._id, note.title, note.fileFormat)}
                              size="sm"
                              className="w-full flex items-center justify-center space-x-1 bg-gradient-to-r from-studyroot-blue to-studyroot-purple hover:from-studyroot-purple hover:to-studyroot-blue text-xs"
                            >
                              <Download className="h-3 w-3" />
                              <span>Download</span>
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-between text-xs text-muted-foreground font-medium px-2">
                          <div>Views: {note.views?.toLocaleString() || 0}</div>
                          <div>Downloads: {note.downloads.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-studyroot-blue to-studyroot-purple p-3 rounded-xl">
                          <FileText className="h-6 w-6 text-white" />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground mb-2">{note.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                            <span className="bg-muted px-2 py-1 rounded-full font-medium">
                              {note.fileFormat}
                            </span>
                            <span>{note.fileSize}</span>
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{userNames[note.uploadedBy?._id] || "Unknown"}</span>
                            </div>

                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span className="truncate max-w-24 sm:max-w-none">{userNames[note.uploadedBy?._id] || "Unknown"}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span className="text-xs">{note.uploadDate}</span>
                              </div>
                            </div>
                          </div>
                        </div >
                      </div >

                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex space-x-2">
                          <div className="relative group">
                            <Button
                              onClick={() => isPreviewSupported(note.fileFormat) && handleView(note)}
                              variant="outline"
                              size="sm"
                              disabled={!isPreviewSupported(note.fileFormat)}
                              className={`flex items-center space-x-1 border-studyroot-blue text-studyroot-blue 
                              ${isPreviewSupported(note.fileFormat) ? 'hover:bg-studyroot-blue hover:text-white' : 'cursor-not-allowed opacity-50'}`}
                            >
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </Button>

                            {!isPreviewSupported(note.fileFormat) && (
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-1 py-1 opacity-0 group-hover:opacity-40 transition-all duration-300 pointer-events-none">
                                Preview not supported for this file type
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={() => handleDownload(note._id, note.title, note.fileFormat)}
                            size="sm"
                            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1 bg-gradient-to-r from-studyroot-blue to-studyroot-purple hover:from-studyroot-purple hover:to-studyroot-blue text-xs sm:text-sm h-8 sm:h-9"
                          >
                            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Download</span>
                          </Button>
                        </div>

                        <div className="flex items-center space-x-2 mt-2">
                          <InteractiveStarRating
                            rating={userNoteRatings[note._id] || 0}
                            size="md"
                            onRatingChange={(rating) => handleNoteRatingChange(note._id, rating)}
                          />
                          <span className="text-xs text-muted-foreground">
                            Avg: {noteRatings[note._id]?.averageRating?.toFixed(2) || "0.00"} ({noteRatings[note._id]?.totalRatings || 0} ratings)
                          </span>
                          {ratingLoading[note._id] && <span className="text-xs text-blue-500 ml-2">.</span>}
                        </div>
                      </div>
                    </div >
                  </CardContent >
                </Card >
              ))}
            </div >
          ) : !loading && !error ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">No Notes Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
                {searchQuery
                  ? `No notes match your search for "${searchQuery}"`
                  : "No notes have been uploaded for this subject yet. Check back later!"}
              </p>
            </div>
          ) : null}

        {/* Comments Section - Mobile Responsive */}
        <div className="mt-8 sm:mt-12 max-w-3xl mx-auto px-2 sm:px-0">
          <button
            onClick={() => setCommentsVisible(!commentsVisible)}
            className="flex items-center space-x-2 text-xl sm:text-2xl font-semibold mb-4 text-foreground focus:outline-none"
            aria-expanded={commentsVisible}
            aria-controls="comments-section"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-studyroot-blue" />
            <span>Comments</span>
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform duration-300 ${commentsVisible ? "transform rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {commentsVisible && (
            <>
              {loadingComments ? (
                <div className="text-center text-gray-500 py-4 sm:py-6 text-sm sm:text-base">Loading comments...</div>
              ) : errorComments ? (
                <div className="text-center text-red-500 py-4 sm:py-6 text-sm sm:text-base">{errorComments}</div>
              ) : (
                <>
                  {authUser ? (
                    <div className="mb-4 sm:mb-6">
                      <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-border p-3 resize-none focus:outline-none focus:ring-2 focus:ring-studyroot-blue text-sm sm:text-base"
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          onClick={handlePostComment}
                          disabled={!newComment.trim() || postingComment}
                          className={`bg-studyroot-blue text-white hover:bg-studyroot-purple text-sm sm:text-base ${postingComment ? "opacity-50 cursor-wait" : ""
                            }`}
                        >
                          {postingComment ? "Posting..." : "Post Comment"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base px-4">
                      Please log in to post comments.
                    </p>
                  )}

                  {comments.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm sm:text-base px-4">No comments yet. Be the first to comment!</p>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {comments.map((comment) => (
                        <Card
                          key={comment._id}
                          className="bg-card/80 backdrop-blur-sm border-l-4 border-studyroot-blue shadow-md"
                        >
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-start space-x-3 sm:space-x-4">
                              <img
                                src={comment.user.profilePic || "/placeholder.svg"}
                                alt={comment.user.fullName}
                                className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h3 className="font-semibold text-foreground text-sm sm:text-base truncate pr-2">{comment.user.fullName}</h3>
                                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                  </span>
                                </div>
                                <p className="mt-1 text-foreground whitespace-pre-wrap text-sm sm:text-base break-words">{comment.content}</p>
                                <div className="flex items-center space-x-3 sm:space-x-4 mt-2 text-xs sm:text-sm text-muted-foreground">
                                  <button
                                    onClick={() => handleLikeComment(comment._id)}
                                    className={`flex items-center space-x-1 ${comment.likedByUser
                                      ? "text-red-600 fill-red-600"
                                      : "text-muted-foreground hover:text-red-600"
                                      } transition-colors duration-300`}
                                    aria-label="Like comment"
                                  >
                                    <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{typeof comment.likes === "number" ? comment.likes : (comment.likes?.length || 0)}</span>
                                  </button>
                                  {authUser && authUser._id === comment.user._id && (
                                    <button
                                      onClick={() => handleDeleteComment(comment._id)}
                                      className={`flex items-center space-x-1 text-red-500 hover:text-red-700 ${deletingCommentId === comment._id ? "opacity-50 cursor-wait" : ""
                                        }`}
                                      aria-label="Delete comment"
                                      disabled={deletingCommentId === comment._id}
                                    >
                                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                      <span>Delete</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Pagination Buttons - Mobile Responsive */}
                  <div className="flex justify-center space-x-1 sm:space-x-2 mt-4 sm:mt-6 overflow-x-auto">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <Button
                        key={pageNum}
                        onClick={() => setCommentsPage(pageNum)}
                        className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap ${commentsPage === pageNum ? "bg-studyroot-blue text-white" : "bg-muted text-muted-foreground"
                          }`}
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div >
    </div >
  );
};

export default SubjectView;