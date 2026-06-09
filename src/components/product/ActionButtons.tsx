"use client";

import { useState } from "react";
import { ShoppingCart, Zap, Check } from "lucide-react";
import { useSession } from "next-auth/react";
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

  const doAddToCart = async () => {
    setAddingToCart(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        incrementCart();
        setAddedToCart(true);
        toast.success("Added to cart!", {
          style: { background: "#ffffff", color: "#1f2937", border: "1px solid #e5e7eb" },
          iconTheme: { primary: "#4f46e5", secondary: "#fff" },
        });
        setTimeout(() => setAddedToCart(false), 2500);
      } else {
        throw new Error("Failed");
      }
    } catch {
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const doBuyNow = async () => {
    setBuyingNow(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        incrementCart();
        router.push("/cart");
      } else {
        throw new Error("Failed");
      }
    } catch {
      toast.error("Failed. Please try again.");
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
        className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-indigo-600 bg-white px-6 py-3.5 text-sm font-semibold text-indigo-600 transition-all hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
      >
        {addedToCart ? (
          <>
            <Check size={18} className="text-green-600" /> Added
          </>
        ) : addingToCart ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600/25 border-t-indigo-600" /> Adding...
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
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-xs"
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
