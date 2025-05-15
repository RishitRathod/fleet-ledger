"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  adminName: string;
  name: string; // The invited user's name
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        if (!email) return;

        const response = await fetch(
          `${import.meta.env.VITE_SERVER_ORIGIN}/api/invitations/user/notifications`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );

        const data = await response.json();
        if (response.ok && Array.isArray(data.invitations)) {
          setNotifications(data.invitations);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchNotifications();
  }, [isOpen]);

  const handleAction = async (id: string, action: "accept" | "reject") => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_ORIGIN}/api/invitations/${action}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error(`Error ${action}ing invitation`, error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-center">
            Vehicle Invitations
          </DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto py-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No pending invitations
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-card rounded-lg p-4 shadow-sm border hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">New Invitation</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      <span className="font-medium text-foreground">
                        {notification.adminName}
                      </span>{" "}
                      has invited{" "}
                      <span className="font-medium text-foreground">
                        {notification.name}
                      </span>{" "}
                      to join.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(notification.id, "reject")}
                    className="hover:bg-red-600 hover:text-white"
                  >
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAction(notification.id, "accept")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Accept Invitation
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
