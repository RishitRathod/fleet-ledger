import { create } from "zustand";

interface RefuelingModalStore {
  isOpen: boolean;
  type: "refueling" | null;
  onOpen: (type: "refueling") => void;
  onClose: () => void;
  openFromSidebar: () => void;
}

export const useRefuelingModal = create<RefuelingModalStore>((set) => ({
  isOpen: false,
  type: null,
  onOpen: (type: "refueling") => set({ isOpen: true, type }),
  onClose: () => set({ isOpen: false, type: null }),
  openFromSidebar: () => set({ isOpen: true, type: "refueling" }),
}));
