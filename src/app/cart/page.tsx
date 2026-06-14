"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShoppingCart, Zap } from "lucide-react";
import { CartItem } from "@/types";
import Spinner from "@/components/ui/Spinner";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";

export default function CartPage() {
  const { status } = useSession();
  const router = useRouter();
  const { setCartCount } = useStore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : [];
        setCartItems(items);
        // Sync header badge with real server count
        const count = items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0);
        setCartCount(count);
      }
    } finally {
      setLoading(false);
    }
  }, [setCartCount]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth?callbackUrl=/cart");
      return;
    }
    if (status === "authenticated") void fetchCart();
  }, [status, fetchCart, router]);

  const updateQty = async (cartItemId: string, quantity: number) => {
    setUpdatingId(cartItemId);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        // Update local list
        if (quantity < 1) {
          setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
        } else {
          setCartItems((prev) => prev.map((i) => (i.id === cartItemId ? { ...i, quantity } : i)));
        }
        // Sync header badge from server response
        if (data.cartCount !== undefined) {
          setCartCount(data.cartCount);
        }
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (cartItemId: string) => {
    setUpdatingId(cartItemId);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
        // Sync header badge from server response (goes to 0 when cart is empty)
        if (data.cartCount !== undefined) {
          setCartCount(data.cartCount);
        }
        toast.success("Item removed from cart", {
          style: { background: "#ffffff", color: "#1f2937", border: "1px solid #e5e7eb" },
        });
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const savings = cartItems.reduce(
    (sum, item) => sum + (item.product.originalPrice - item.product.price) * item.quantity,
    0
  );
  const delivery = subtotal >= 499 ? 0 : 49;
  const total = subtotal + delivery;

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 bg-[#050507]">
        <div className="rounded-xl border border-red-950/20 bg-[#0a0a0c] px-6 py-10 text-center shadow-xs">
          <Spinner size={40} />
          <p className="mt-4 text-sm text-gray-400 uppercase tracking-wider font-mono">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10 bg-[#050507] text-white">
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white cursor-pointer font-mono"
        >
          <ArrowLeft size={16} /> CONTINUE SHOPPING
        </button>
        <div className="h-5 w-px bg-white/10" />
        <div className="inline-flex items-center gap-2 text-white">
          <ShoppingCart size={18} className="text-red-500" />
          <h1 className="text-xl font-black uppercase tracking-wider font-mono">
            MY CART <span className="text-gray-500 font-normal">({cartItems.length})</span>
          </h1>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex min-h-[56vh] items-center justify-center rounded-xl border border-red-950/20 bg-[#0a0a0c] px-6 py-12 text-center shadow-xs">
          <div className="max-w-md">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-red-950/20 bg-black text-red-500">
              <ShoppingBag size={36} />
            </div>
            <h2 className="mt-5 text-2xl font-black text-white uppercase tracking-tight font-mono">Your cart is empty</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400 font-mono">Add a few products and they will show up here for review and checkout.</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 cursor-pointer shadow-sm font-mono"
            >
              <ShoppingBag size={16} /> START SHOPPING
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            {cartItems.map((item) => {
              const images: string[] = JSON.parse(item.product.images);
              return (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-white/5 bg-[#0a0a0c] p-4 transition-colors hover:border-red-950/30 shadow-2xs"
                >
                  <Link href={`/product/${item.productId}`} className="shrink-0">
                    <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-red-950/20 bg-red-950/5">
                      <Image src={images[0]} alt={item.product.title} fill className="object-contain p-1" sizes="96px" />
                    </div>
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${item.productId}`}>
                      <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-white transition-colors hover:text-red-400 font-mono uppercase">
                        {item.product.title}
                      </h3>
                    </Link>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-red-500 font-mono">{item.product.brand}</p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-white font-mono">
                            ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-gray-500 line-through font-mono">
                            ₹{(item.product.originalPrice * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-400 font-mono">Quantity {item.quantity}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center overflow-hidden rounded-lg border border-white/10 bg-[#0c0c0f]">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            disabled={updatingId === item.id}
                            className="inline-flex h-8 w-8 items-center justify-center text-gray-400 transition-colors hover:bg-red-950/20 hover:text-white disabled:opacity-50 cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="inline-flex h-8 w-9 items-center justify-center text-sm font-semibold text-white font-mono">
                            {updatingId === item.id ? (
                              <div className="h-3 w-3 animate-spin rounded-full border border-gray-600 border-t-white" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            disabled={updatingId === item.id}
                            className="inline-flex h-8 w-8 items-center justify-center text-gray-400 transition-colors hover:bg-red-950/20 hover:text-white disabled:opacity-50 cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updatingId === item.id}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:border-red-600 hover:bg-red-950/20 hover:text-red-500 disabled:opacity-50 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-red-950/20 bg-[#0a0a0c] p-6 shadow-xs">
              <h2 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white font-mono">
                <ShoppingBag size={18} className="text-red-500" /> ORDER SUMMARY
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-mono">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-white font-mono">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-mono">Discount</span>
                    <span className="font-semibold text-red-500 font-mono">-₹{savings.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-mono">Delivery</span>
                  <span className={delivery === 0 ? "font-semibold text-red-500 font-mono" : "font-semibold text-white font-mono"}>
                    {delivery === 0 ? "FREE" : `₹${delivery}`}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="font-bold text-white uppercase tracking-wider font-mono">Total</span>
                  <span className="text-xl font-black text-white font-mono">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {savings > 0 && (
                <div className="mt-5 rounded-lg border border-red-950/30 bg-red-950/10 px-4 py-3 text-center">
                  <p className="text-sm font-bold text-red-500 font-mono">
                    YOU SAVE ₹{savings.toLocaleString("en-IN")} ON THIS ORDER
                  </p>
                </div>
              )}

              <Link
                href="/checkout"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-red-700 cursor-pointer shadow-lg shadow-red-600/20 hover:shadow-red-600/40 font-mono"
              >
                <Zap size={16} /> PROCEED TO CHECKOUT
              </Link>
              <Link href="/" className="mt-4 block text-center text-sm text-gray-400 transition-colors hover:text-white font-mono">
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
