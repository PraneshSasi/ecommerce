import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      toggleWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.includes(id)
            ? state.wishlist.filter((item) => item !== id)
            : [...state.wishlist, id],
        })),
      isWishlisted: (id) => get().wishlist.includes(id),
      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "shopwave-wishlist",
    }
  )
);
