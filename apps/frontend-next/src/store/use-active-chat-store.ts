import { create } from "zustand";

interface ActiveChatStore {
  activeChatId: number | null;
  setActiveChatId: (id: number | null) => void;
}

export const useActiveChatStore = create<ActiveChatStore>((set) => ({
  activeChatId: null,
  setActiveChatId: (id) => set({ activeChatId: id }),
}));
