"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";
import Spinner from "@/components/ui/Spinner";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    images: string; // JSON array string
  };
}

export default function CartSidebar() {
  const { data: session } = useSession();
  const { isCartSidebarOpen, closeCartSidebar, cartCount, setCartCount } = useStore();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Fetch cart items when sidebar opens
  useEffect(() => {
    if (isCartSidebarOpen && session) {
      setLoading(true);
      fetch("/api/cart")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch cart");
          return res.json();
        })
        .then((data) => {
          setItems(data);
          // Sync count
          const totalCount = data.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
          setCartCount(totalCount);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Could not load cart items");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isCartSidebarOpen, session, setCartCount]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartSidebarOpen) {
        closeCartSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartSidebarOpen, closeCartSidebar]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isCartSidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isCartSidebarOpen]);

  const updateQuantity = async (cartItemId: string, newQty: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity: newQty }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      const data = await response.json();
      
      if (newQty < 1) {
        setItems((prev) => prev.filter((item) => item.id !== cartItemId));
      } else {
        setItems((prev) =>
          prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
        );
      }
      
      setCartCount(data.cartCount);
      toast.success("Cart updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update cart");
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId }),
      });

      if (!response.ok) throw new Error("Failed to delete item");

      const data = await response.json();
      setItems((prev) => prev.filter((item) => item.id !== cartItemId));
      setCartCount(data.cartCount);
      toast.success("Item removed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCartSidebar}
        className={`fixed inset-0 z-60 bg-black/65 backdrop-blur-xs transition-opacity duration-300 ${
          isCartSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        ref={sidebarRef}
        className={`fixed right-0 top-0 bottom-0 z-60 flex h-full w-full max-w-md flex-col border-l border-red-950/20 bg-[#0a0a0c] text-white transition-transform duration-300 ease-in-out ${
          isCartSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-950/20 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-red-500" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] font-mono">
              YOUR CART ({cartCount})
            </h2>
          </div>
          <button
            onClick={closeCartSidebar}
            className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/5 hover:text-white cursor-pointer"
            aria-label="Close cart sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!session ? (
            <div className="flex h-64 flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag size={48} className="text-white/20" />
              <p className="text-sm text-white/50 uppercase tracking-widest font-mono">
                Please sign in to view your cart
              </p>
              <Link
                href="/auth"
                onClick={closeCartSidebar}
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-slate-200"
              >
                Sign In
              </Link>
            </div>
          ) : loading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size={32} />
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag size={48} className="text-white/20 animate-bounce" />
              <p className="text-sm text-white/50 uppercase tracking-widest font-mono">
                Your cart is empty
              </p>
              <button
                onClick={closeCartSidebar}
                className="inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-red-600/10 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-red-550 transition-colors hover:bg-red-600 hover:text-white cursor-pointer"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-red-950/10">
              {items.map((item) => {
                const images: string[] = JSON.parse(item.product.images);
                const firstImage = images[0] || "/placeholder.jpg";

                return (
                  <div key={item.id} className="flex gap-4 pt-4 first:pt-0">
                    {/* Image */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-1">
                      <Image
                        src={firstImage}
                        alt={item.product.title}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="line-clamp-1 text-xs font-bold uppercase tracking-wider text-white">
                          {item.product.title}
                        </h3>
                        <p className="text-xs font-semibold text-red-550 font-mono mt-0.5">
                          ₹{item.product.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-5 w-5 items-center justify-center rounded-sm text-white/50 hover:bg-white/5 hover:text-white cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="w-6 text-center text-xs font-black font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-5 w-5 items-center justify-center rounded-sm text-white/50 hover:bg-white/5 hover:text-white cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-white/40 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          aria-label="Delete item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sticky footer */}
        {session && items.length > 0 && (
          <div className="border-t border-red-950/20 bg-black/60 p-6 space-y-4">
            <div className="flex items-center justify-between font-mono">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                SUBTOTAL
              </span>
              <span className="text-base font-black text-white">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>

            <div className="grid gap-2">
              <Link
                href="/cart"
                onClick={closeCartSidebar}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"
              >
                VIEW FULL CART
              </Link>
              <Link
                href="/checkout"
                onClick={closeCartSidebar}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-700 to-red-650 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:brightness-110"
              >
                CHECKOUT <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
