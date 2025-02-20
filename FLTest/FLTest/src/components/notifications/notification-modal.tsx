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
  senderName: string
  vehicleName: string
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
  const pendingNotifications = notifications.filter(n => n.status === 'pending')
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-center">Vehicle Invitations</DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
            onClick={onClose}
          >
            {/* <X className="h-4 w-4" /> */}
          </Button>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto py-4">
          {pendingNotifications.length === 0 ? (
            <p className="text-center text-muted-foreground">No pending invitations</p>
          ) : (
            pendingNotifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-card rounded-lg p-4 shadow-sm border hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">New Vehicle Invitation</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      <span className="font-medium text-foreground">{notification.senderName}</span> has invited you to join their vehicle{' '}
                      <span className="font-medium text-foreground">{notification.vehicleName}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReject(notification.id)}
                    className="hover:bg-destructive hover:text-destructive-foreground"
                  >
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onAccept(notification.id)}
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
  )
}
