"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { AppSidebar } from "@/components/app-sidebar";
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
  const [password, setPassword] = useState("");

  const handleAddUser = () => {
    // TODO: Implement user addition logic
    console.log("Adding user:", { username, password });
    // Reset form
    setUsername("");
    setPassword("");
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
                {/* <p className="text-muted-foreground">Manage your fleet users and permissions</p> */}
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
                    {/* <div>
                      <label className="text-sm font-medium">Password</label>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div> */}
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
            
            {/* Users List */}
            
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Users;
