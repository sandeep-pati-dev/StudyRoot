import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "@/lib/axiosInstance";
import { toast } from "@/hooks/use-toast";
import { User, Crown, Shield, Mail, ChevronRight, AlertTriangle, X } from "lucide-react";

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

const ManageUsersSection = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/profile/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async () => {
    if (!selectedUser) return;

    try {
      await axios.put(`/profile/make-admin/${selectedUser._id}`);
      toast({
        title: "Success",
        description: `${selectedUser.fullName} has been promoted to admin!`,
      });
      fetchUsers();
      setShowConfirmDialog(false);
      setSelectedUser(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not make user an admin",
        variant: "destructive",
      });
    }
  };

  const handleMakeAdminClick = (user: UserData) => {
    setSelectedUser(user);
    setShowConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="w-full max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="bg-card/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center space-x-4 mb-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Manage Users
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">
                View and manage user permissions
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 rounded-xl border border-blue-200/50">
              <p className="text-blue-800 font-semibold text-lg sm:text-xl">{users.length}</p>
              <p className="text-blue-600 text-xs sm:text-sm">Total Users</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 p-4 rounded-xl border border-purple-200/50">
              <p className="text-purple-800 font-semibold text-lg sm:text-xl">
                {users.filter(user => user.role === 'admin').length}
              </p>
              <p className="text-purple-600 text-xs sm:text-sm">Admins</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100/50 p-4 rounded-xl border border-green-200/50 col-span-2 sm:col-span-1">
              <p className="text-green-800 font-semibold text-lg sm:text-xl">
                {users.filter(user => user.role !== 'admin').length}
              </p>
              <p className="text-green-600 text-xs sm:text-sm">Regular Users</p>
            </div>
          </div>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="bg-card/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-8 shadow-lg text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-card/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-8 shadow-lg text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {users.map((user) => (
              <Card
                key={user._id}
                className="bg-card/95 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2.5 sm:p-3 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-200 shrink-0">
                        <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base sm:text-lg font-bold text-foreground truncate pr-2">
                            {user.fullName}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Role Badge and Action Button Container */}
                    <div className="flex items-center space-x-3 shrink-0 ml-4">
                      {/* Role Badge */}
                      {user.role === "admin" ? (
                        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-full">
                          <Crown className="h-3.5 w-3.5 text-yellow-600" />
                          <span className="text-xs font-semibold text-yellow-800">Admin</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
                          <Shield className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-xs font-medium text-gray-600">User</span>
                        </div>
                      )}

                      {/* Action Button or Status */}
                      {user.role === "admin" ? (
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-green-100/50 border border-green-200/50 rounded-xl">
                          <Crown className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Administrator</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleMakeAdminClick(user)}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group/btn"
                        >
                          <Crown className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                          <span className="hidden sm:inline">Make Admin</span>
                          <span className="sm:hidden">Admin</span>
                          <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-card/95 w-full max-w-md mx-auto shadow-2xl border-0">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Confirm Admin Promotion
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Are you sure you want to promote{" "}
                    <span className="font-semibold text-foreground">{selectedUser.fullName}</span> to admin?
                    This action will give them administrative privileges.
                  </p>
                </div>
                <button
                  onClick={closeConfirmDialog}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={closeConfirmDialog}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={makeAdmin}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ManageUsersSection;