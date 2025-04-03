"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

interface UsersProps {
  className?: string;
}

const Users = ({ className }: UsersProps) => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const adminemail = localStorage.getItem("email");

  useEffect(() => {
    if (adminemail) {
      fetchUsers();
    }
  }, [adminemail]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/users/admin/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: adminemail }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setUsers(data.users);
      } else {
        console.error("Error fetching users:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleAddUser = async () => {
    if (!adminemail) {
      console.error("Admin email not found in localStorage");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:5001/api/invitations/admin/invite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminemail, name: username }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Invitation sent successfully:", data);
        fetchUsers(); // Refresh users list
      } else {
        console.error("Error sending invitation:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }

    setUsername("");
    setShowAddUser(false);
  };

  return (
    <div className="grid lg:grid-cols-[auto,1fr] min-h-screen">
      <AppSidebar />
      <div>
        <ScrollArea className="h-screen">
          <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Users Management</h1>
              <Button onClick={() => setShowAddUser(true)} className="gap-2">
                <UserPlus className="h-4 w-4" /> Add User
              </Button>
            </div>

            <div className="space-y-4">
              {users.length > 0 ? (
                users.map((user) => (
                  <Card key={user.id} className="p-4 flex justify-between">
                    <span>{user.name}</span>
                    <span className="text-sm text-gray-500">{user.status}</span>
                  </Card>
                ))
              ) : (
                <p>No users found under this admin.</p>
              )}
            </div>

            {showAddUser && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <Card className="w-full max-w-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Add New User</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Username</label>
                      <Input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddUser(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="outline" onClick={handleAddUser}>
                        Send Invite
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Users;
