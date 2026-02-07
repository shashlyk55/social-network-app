import { create } from "zustand";

interface SelectMembersState {
  selectedIds: number[];
  toggleMember: (id: number) => void;
  reset: () => void;
}

export const useSelectMembersStore = create<SelectMembersState>((set) => ({
  selectedIds: [],
  toggleMember: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((itemId) => itemId !== id)
        : [...state.selectedIds, id],
    })),
  reset: () => set({ selectedIds: [] }),
}));
