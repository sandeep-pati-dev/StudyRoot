import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  User,
  GraduationCap,
  Shield,
  Trash2,
  Camera,
  Save,
  Edit,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axiosInstance";
import Navbar from "@/components/Navbar";

// Interface for the user profile data structure
interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profilePic?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  location?: string;
  currentCourse?: string;
  currentSemester?: number;
  university?: string;
  studentId?: string;
  branch?: string;
  academicYear?: string;
  preferences?: {
    notifications: {
      email: boolean;
      downloads: boolean;
      courseUpdates: boolean;
    };
    theme: string;
    language: string;
    defaultCourse?: string;
  };
  activity?: {
    lastLogin: string;
    totalDownloads: number;
    favoriteNotes: any[];
    downloadHistory: any[];
  };
  profileCompletion: number;
  createdAt: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { authUser, logout } = useAuthStore();
  const { toast } = useToast();

  // State management
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

  // Form states for personal and academic info
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    bio: "",
    location: "",
    currentCourse: "",
    currentSemester: "",
    university: "",
    studentId: "",
    branch: "",
    academicYear: "",
  });

  // Preferences states
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      downloads: true,
      courseUpdates: true,
    },
    theme: "light",
    language: "en",
    defaultCourse: "",
  });

  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete account states
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);


  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/profile");
      const userProfile = response.data.data;
      setProfile(userProfile);

      // Populate form data from the fetched profile
      setFormData({
        fullName: userProfile.fullName || "",
        phoneNumber: userProfile.phoneNumber || "",
        dateOfBirth: userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth).toISOString().split('T')[0] : "",
        gender: userProfile.gender || "",
        bio: userProfile.bio || "",
        location: userProfile.location || "",
        currentCourse: userProfile.currentCourse || "",
        currentSemester: userProfile.currentSemester?.toString() || "",
        university: userProfile.university || "",
        studentId: userProfile.studentId || "",
        branch: userProfile.branch || "",
        academicYear: userProfile.academicYear || "",
      });

      // Populate preferences from the fetched profile or set defaults
      setPreferences(userProfile.preferences || {
        notifications: { email: true, downloads: true, courseUpdates: true },
        theme: "light",
        language: "en",
        defaultCourse: "",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Clean form data: convert empty strings to undefined to avoid validation errors for optional fields
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value || undefined])
      );

      const response = await axios.put("/profile", cleanedFormData);
      setProfile(response.data.data);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.put("/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to change password",
        variant: "destructive",
      });
    }
  };

  /**
   * Handles the account deletion request.
   */
  const handleDeleteAccount = async () => {
    try {
      await axios.delete("/profile", { data: { password: deletePassword } });
      toast({
        title: "Success",
        description: "Account deleted successfully",
      });
      await logout();
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  /**
   * Handles the profile picture upload.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
   */
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const pictureFormData = new FormData();
    pictureFormData.append("profilePicture", file);

    setIsUploadingPicture(true);

    try {
      const response = await axios.put("/profile/picture", pictureFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(response.data.data);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPicture(false);
    }
  };

  // Loading state UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-uninote-blue"></div>
        </div>
      </div>
    );
  }

  // Profile not found state UI
  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Profile Not Found</h2>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar and Upload Button */}
              <div className="relative flex-shrink-0">
                <Avatar className={`h-24 w-24 text-3xl transition-opacity ${isUploadingPicture ? 'opacity-50' : 'opacity-100'}`}>
                  <AvatarImage src={profile.profilePic} alt={profile.fullName} />
                  <AvatarFallback className="bg-gradient-to-r from-uninote-blue to-uninote-purple text-white">
                    {profile.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {isUploadingPicture && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                  </div>
                )}

                {!isUploadingPicture && (
                  <label className="absolute bottom-0 right-0 bg-card rounded-full p-2 shadow-lg cursor-pointer hover:bg-muted-foreground transition-colors">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Profile Info and Completion */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{profile.fullName}</h1>
                <p className="text-muted-foreground mt-1">{profile.email}</p>
                <div className="flex items-center justify-center sm:justify-start space-x-4 mt-2">
                  <Badge variant={profile.role === "admin" ? "default" : "secondary"}>
                    {profile.role}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Member since {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">Profile Completion</span>
                    <span className="text-sm font-medium text-uninote-blue">{profile.profileCompletion}%</span>
                  </div>
                  <Progress value={profile.profileCompletion} className="h-2" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4 sm:mt-0">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList
            className="flex w-full justify-around bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 
             text-white rounded-xl p-2 shadow-lg backdrop-blur-md"
          >
            <TabsTrigger
              value="personal"
              className="flex-1 mx-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300
               data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow
               hover:bg-muted"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>

            <TabsTrigger
              value="academic"
              className="flex-1 mx-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300
               data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow
               hover:bg-muted"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Academic</span>
            </TabsTrigger>

            <TabsTrigger
              value="security"
              className="flex-1 mx-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300
               data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow
               hover:bg-muted"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>


          <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent my-4" />


          {/* Personal Information Tab */}
          <TabsContent value="personal" className="mt-6 bg-card/80 rounded-2xl p-6 backdrop-blur-md shadow-md">
            <Card>
              <CardHeader>
                <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><Label htmlFor="fullName">Full Name *</Label><Input id="fullName" value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} disabled={!isEditing} /></div>
                  <div><Label htmlFor="email">Email</Label><Input id="email" value={profile.email} disabled className="bg-muted cursor-not-allowed" /></div>
                  <div><Label htmlFor="phoneNumber">Phone Number</Label><Input id="phoneNumber" value={formData.phoneNumber} onChange={(e) => handleInputChange("phoneNumber", e.target.value)} disabled={!isEditing} /></div>
                  <div><Label htmlFor="dateOfBirth">Date of Birth</Label><Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} disabled={!isEditing} /></div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)} disabled={!isEditing}>
                      <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label htmlFor="location">Location</Label><Input id="location" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} disabled={!isEditing} /></div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={formData.bio} onChange={(e) => handleInputChange("bio", e.target.value)} disabled={!isEditing} placeholder="Tell us about yourself..." maxLength={500} rows={4} />
                  <p className="text-sm text-muted-foreground text-right">{formData.bio?.length || 0}/500</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Information Tab */}
          <TabsContent value="academic" className="mt-6 bg-card/80 rounded-2xl p-6 backdrop-blur-md shadow-md">
            <Card>
              <CardHeader>
                <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">Academic Information</CardTitle>
                <CardDescription>Update your academic details and course information.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="currentCourse">Current Course</Label>
                  <Select value={formData.currentCourse} onValueChange={(value) => handleInputChange("currentCourse", value)} disabled={!isEditing}>
                    <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                    <SelectContent><SelectItem value="btech">B.Tech</SelectItem><SelectItem value="mca">MCA</SelectItem><SelectItem value="bca">BCA</SelectItem><SelectItem value="mba">MBA</SelectItem><SelectItem value="others">Others</SelectItem></SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currentSemester">Current Semester</Label>
                  <Select value={formData.currentSemester} onValueChange={(value) => handleInputChange("currentSemester", value)} disabled={!isEditing}>
                    <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
                    <SelectContent>{Array.from({ length: 12 }, (_, i) => (<SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div><Label htmlFor="university">University/College</Label><Input id="university" value={formData.university} onChange={(e) => handleInputChange("university", e.target.value)} disabled={!isEditing} /></div>
                <div><Label htmlFor="studentId">Student ID</Label><Input id="studentId" value={formData.studentId} onChange={(e) => handleInputChange("studentId", e.target.value)} disabled={!isEditing} /></div>
                <div><Label htmlFor="branch">Branch/Specialization</Label><Input id="branch" value={formData.branch} onChange={(e) => handleInputChange("branch", e.target.value)} disabled={!isEditing} placeholder="e.g., Computer Science" /></div>
                <div><Label htmlFor="academicYear">Academic Year</Label><Input id="academicYear" value={formData.academicYear} onChange={(e) => handleInputChange("academicYear", e.target.value)} disabled={!isEditing} placeholder="e.g., 2023-2024" /></div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-6 bg-card/80 rounded-2xl p-6 backdrop-blur-md shadow-md">
            <Card>
              <CardHeader><CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">Change Password</CardTitle><CardDescription>Update your account password.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div><Label htmlFor="currentPassword">Current Password</Label><Input id="currentPassword" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))} /></div>
                <div><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))} /></div>
                <div><Label htmlFor="confirmPassword">Confirm New Password</Label><Input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))} /></div>
                <Button onClick={handleChangePassword} className="w-full sm:w-auto">Change Password</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-destructive-foreground">Delete Account</CardTitle><CardDescription>Permanently delete your account and all associated data.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-destructive-foreground text-sm"><strong>Warning:</strong> This action is irreversible. All your data will be permanently deleted.</p></div>
                {!showDeleteConfirm ? (
                  <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} className="w-full sm:w-auto"><Trash2 className="h-4 w-4 mr-2" />Delete My Account</Button>
                ) : (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div><Label htmlFor="deletePassword">To confirm, please enter your password</Label><Input id="deletePassword" type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="Enter your password" /></div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="destructive" onClick={handleDeleteAccount} className="flex-1">Confirm Deletion</Button>
                      <Button variant="outline" onClick={() => { setShowDeleteConfirm(false); setDeletePassword(""); }} className="flex-1">Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;