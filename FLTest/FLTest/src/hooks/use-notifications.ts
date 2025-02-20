import { create } from 'zustand'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  status: 'pending' | 'accepted' | 'rejected'
}

interface NotificationStore {
  isOpen: boolean
  notifications: Notification[]
  onOpen: () => void
  onClose: () => void
  onAccept: (id: string) => void
  onReject: (id: string) => void
  addNotification: (notification: Omit<Notification, 'id' | 'status'>) => void
}

export const useNotifications = create<NotificationStore>((set) => ({
  isOpen: false,
  notifications: [],
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onAccept: (id: string) => set((state) => ({
    notifications: state.notifications.map((notification) =>
      notification.id === id ? { ...notification, status: 'accepted' } : notification
    ),
  })),
  onReject: (id: string) => set((state) => ({
    notifications: state.notifications.map((notification) =>
      notification.id === id ? { ...notification, status: 'rejected' } : notification
    ),
  })),
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending'
      }
    ],
  })),
}))
