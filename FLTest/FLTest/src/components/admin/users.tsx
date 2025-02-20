"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { UserPlus } from "lucide-react";

interface UsersProps {
  className?: string;
}

const Users = ({ className }: UsersProps) => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [username, setUsername] = useState("");

  const handleAddUser = async () => {
    const adminemail =localStorage.getItem("email"); // Extract email safely
    
    console.log(adminemail); // Should print: "jay@gmail.com"
        if (!adminemail) {
      console.error("Admin email not found in localStorage");
      return;
    }
    console.log("Admin email:", adminemail);
    console.log("Username:", username);
    try {
      const response = await fetch("http://localhost:5000/api/invitations/admin/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass auth token
        },
        body: JSON.stringify({ adminemail, name: username }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Invitation sent successfully:", data);
      } else {
        console.error("Error sending invitation:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }

    // Reset form
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
              <div>
                <h1 className="text-3xl font-bold">Users Management</h1>
              </div>
              <Button onClick={() => setShowAddUser(true)} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </div>

            {/* Add User Dialog */}
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
                      <Button variant="outline" onClick={() => setShowAddUser(false)}>
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
