import { create } from "zustand"

interface ExpenseModalStore {
  type: 'accessories' | 'fuel' | 'service' | 'tax' | null
  isOpen: boolean
  onOpen: (type: 'accessories' | 'fuel' | 'service' | 'tax') => void
  onClose: () => void
}

export const useExpenseModal = create<ExpenseModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ isOpen: true, type }),
  onClose: () => set({ isOpen: false, type: null }),
}))

export const vehicles = [
  { id: 1, name: "Vehicle 1" },
  { id: 2, name: "Vehicle 2" },
  { id: 3, name: "Vehicle 3" },
]
