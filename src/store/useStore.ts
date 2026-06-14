import { create } from "zustand";
import { Product } from "@/types";

interface StoreState {
  cartCount: number;
  setCartCount: (count: number) => void;
  incrementCart: () => void;
  decrementCart: () => void;
  isAuthModalOpen: boolean;
  pendingAction: (() => void) | null;
  openAuthModal: (afterLoginAction?: () => void) => void;
  closeAuthModal: () => void;
  isCartSidebarOpen: boolean;
  openCartSidebar: () => void;
  closeCartSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  buyNowItem: string | null;
  buyNowQuantity: number;
  setBuyNowItem: (id: string | null) => void;
  setBuyNowQuantity: (qty: number) => void;
  clearBuyNow: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  setSelectedCategory: (category: string) => void;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
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

  isCartSidebarOpen: false,
  openCartSidebar: () => set({ isCartSidebarOpen: true }),
  closeCartSidebar: () => set({ isCartSidebarOpen: false }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedCategory: "All",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  buyNowItem: null,
  buyNowQuantity: 0,
  setBuyNowItem: (id) => set({ buyNowItem: id }),
  setBuyNowQuantity: (qty) => set({ buyNowQuantity: qty }),
  clearBuyNow: () => set({ buyNowItem: null, buyNowQuantity: 0 }),
  theme: typeof window !== "undefined" ? localStorage.getItem("shopwave-theme") || "indigo" : "indigo",
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shopwave-theme", theme);
    }
    set({ theme });
  },
  quickViewProduct: null,
  openQuickView: (product) => set({ quickViewProduct: product }),
  closeQuickView: () => set({ quickViewProduct: null }),

  isDarkMode:
    typeof window !== "undefined"
      ? localStorage.getItem("shopwave-darkmode") !== "false"
      : true,
  toggleDarkMode: () =>
    set((state) => {
      const next = !state.isDarkMode;
      if (typeof window !== "undefined") {
        localStorage.setItem("shopwave-darkmode", String(next));
      }
      return { isDarkMode: next };
    }),
}));
