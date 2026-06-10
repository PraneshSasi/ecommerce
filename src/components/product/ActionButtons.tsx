"use client";

import { useState } from "react";
import { ShoppingCart, Zap, Check } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";

interface ActionButtonsProps {
  productId: string;
  disabled?: boolean;
}

export default function ActionButtons({ productId, disabled = false }: ActionButtonsProps) {
  const { data: session } = useSession();
  const { openAuthModal, incrementCart } = useStore();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const router = useRouter();

  /** Shared: call /api/cart POST and return { ok, cartCount, errorMsg, status } */
  const postToCart = async (): Promise<{ ok: boolean; cartCount?: number; errorMsg?: string; status?: number }> => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    if (res.ok) {
      const data = await res.json();
      return { ok: true, cartCount: data.cartCount };
    }

    // Parse error message from server
    let errorMsg = "Failed to add to cart";
    try {
      const data = await res.json();
      errorMsg = data.error || errorMsg;
    } catch {
      // ignore parse failure
    }
    return { ok: false, errorMsg, status: res.status };
  };

  /** Handle stale session (403): sign out and re-open auth modal */
  const handleStaleSession = (pendingAction: () => void) => {
    toast.error("Your session expired. Please sign in again.", { duration: 4000 });
    signOut({ redirect: false }).then(() => {
      // Re-open auth modal which will re-run the pending action after login
      setTimeout(() => openAuthModal(pendingAction), 500);
    });
  };

  const doAddToCart = async () => {
    setAddingToCart(true);
    try {
      const result = await postToCart();
      if (result.ok) {
        if (result.cartCount !== undefined) {
          useStore.getState().setCartCount(result.cartCount);
        } else {
          incrementCart();
        }
        setAddedToCart(true);
        toast.success("Added to cart!", {
          style: { background: "#ffffff", color: "#000000", border: "1px solid #e4e4e7" },
          iconTheme: { primary: "#ea580c", secondary: "#ffffff" },
        });
        setTimeout(() => setAddedToCart(false), 2500);
      } else if (result.status === 403) {
        handleStaleSession(doAddToCart);
      } else {
        toast.error(result.errorMsg || "Failed to add to cart. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setAddingToCart(false);
    }
  };

  const doBuyNow = async () => {
    setBuyingNow(true);
    try {
      const result = await postToCart();
      if (result.ok) {
        if (result.cartCount !== undefined) {
          useStore.getState().setCartCount(result.cartCount);
        } else {
          incrementCart();
        }
        // Store the product ID so checkout page can highlight it
        useStore.getState().setBuyNowItem(productId);
        router.push("/checkout");
      } else if (result.status === 403) {
        setBuyingNow(false);
        handleStaleSession(doBuyNow);
      } else {
        toast.error(result.errorMsg || "Something went wrong. Please try again.");
        setBuyingNow(false);
      }
    } catch {
      toast.error("Network error. Please check your connection.");
      setBuyingNow(false);
    }
  };

  const handleAddToCart = () => {
    if (!session) {
      openAuthModal(doAddToCart);
      return;
    }
    doAddToCart();
  };

  const handleBuyNow = () => {
    if (!session) {
      openAuthModal(doBuyNow);
      return;
    }
    doBuyNow();
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        onClick={handleAddToCart}
        disabled={disabled || addingToCart}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-250 bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-all hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-sm"
      >
        {addedToCart ? (
          <>
            <Check size={18} className="text-orange-700" /> Added
          </>
        ) : addingToCart ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-black" /> Adding...
          </>
        ) : (
          <>
            <ShoppingCart size={18} /> Add to cart
          </>
        )}
      </button>

      <button
        onClick={handleBuyNow}
        disabled={disabled || buyingNow}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-md shadow-orange-600/20"
      >
        {buyingNow ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" /> Processing...
          </>
        ) : (
          <>
            <Zap size={18} /> Buy now
          </>
        )}
      </button>
    </div>
  );
}
