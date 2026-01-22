import { create } from "zustand";

interface ModalStore {
  isEditProfileOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isEditProfileOpen: false,
  onOpen: () => set({ isEditProfileOpen: true }),
  onClose: () => set({ isEditProfileOpen: false }),
}));
