import { create } from "zustand";

interface ChatCreationStore {
  selectedProfileIds: number[];
  toggleProfile: (id: number) => void;
  setSelectedProfileIds: (ids: number[]) => void;
  reset: () => void;
}

export const useChatCreationStore = create<ChatCreationStore>((set) => ({
  selectedProfileIds: [],
  toggleProfile: (id) =>
    set((state) => ({
      selectedProfileIds: state.selectedProfileIds.includes(id)
        ? state.selectedProfileIds.filter((pId) => pId !== id)
        : [...state.selectedProfileIds, id],
    })),
  setSelectedProfileIds: (ids) => set({ selectedProfileIds: ids }),
  reset: () => set({ selectedProfileIds: [] }),
}));
