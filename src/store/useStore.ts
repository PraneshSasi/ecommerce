import { create } from "zustand";

interface StoreState {
  cartCount: number;
  setCartCount: (count: number) => void;
  incrementCart: () => void;
  decrementCart: () => void;
  isAuthModalOpen: boolean;
  pendingAction: (() => void) | null;
  openAuthModal: (afterLoginAction?: () => void) => void;
  closeAuthModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  cartCount: 0,
  setCartCount: (count) => set({ cartCount: count }),
  incrementCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  decrementCart: () =>
    set((state) => ({ cartCount: Math.max(0, state.cartCount - 1) })),

  isAuthModalOpen: false,
  pendingAction: null,
  openAuthModal: (afterLoginAction) =>
    set({ isAuthModalOpen: true, pendingAction: afterLoginAction ?? null }),
  closeAuthModal: () =>
    set({ isAuthModalOpen: false, pendingAction: null }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedCategory: "All",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
