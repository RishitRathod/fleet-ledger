"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  status: 'pending' | 'accepted' | 'rejected'
}

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onAccept: (id: string) => void
  onReject: (id: string) => void
}

export function NotificationModal({
  isOpen,
  onClose,
  notifications,
  onAccept,
  onReject
}: NotificationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Notifications</DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto py-4">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground">No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-card rounded-lg p-4 shadow-sm border"
              >
                <h3 className="font-medium mb-2">{notification.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {notification.message}
                </p>
                {notification.status === 'pending' && (
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReject(notification.id)}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onAccept(notification.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Accept
                    </Button>
                  </div>
                )}
                {notification.status !== 'pending' && (
                  <p className={`text-sm text-right ${
                    notification.status === 'accepted' ? 'text-green-600' : 'text-destructive'
                  }`}>
                    {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
