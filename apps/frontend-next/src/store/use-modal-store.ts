import { PostView } from "@/types/post";
import { create } from "zustand";

export type ModalType =
  | "editProfile"
  | "createPost"
  | "editPost"
  | "createChat"
  | "addMembers";

interface ModalData {
  post?: PostView;
  chatId?: number;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: {} }),
}));
