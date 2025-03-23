import { create } from 'zustand'

interface Notification {
  id: string
  senderName: string
  vehicleName: string
  status: 'pending' | 'accepted' | 'rejected'
}

interface NotificationStore {
  isOpen: boolean
  notifications: Notification[]
  onOpen: () => void
  onClose: () => void
  onAccept: (id: string) => void
  onReject: (id: string) => void
  addInvitation: (senderName: string, vehicleName: string) => void
}

// Demo notification data
const demoNotifications: Notification[] = [
  {
    id: '1',
    senderName: 'John Smith',
    vehicleName: 'Toyota Camry 2024',
    status: 'pending'
  },
  {
    id: '2',
    senderName: 'Sarah Wilson',
    vehicleName: 'Honda Civic 2023',
    status: 'pending'
  }
];

export const useNotifications = create<NotificationStore>((set) => ({
  isOpen: false,
  notifications: demoNotifications, // Using demo data
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
  addInvitation: (senderName: string, vehicleName: string) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        id: Math.random().toString(36).substr(2, 9),
        senderName,
        vehicleName,
        status: 'pending'
      }
    ],
  })),
}))
