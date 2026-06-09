"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShoppingCart, Zap } from "lucide-react";
import { CartItem } from "@/types";
import Spinner from "@/components/ui/Spinner";
import toast from "react-hot-toast";

export default function CartPage() {
  const { status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCartItems(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

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
        if (quantity < 1) {
          setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
        } else {
          setCartItems((prev) => prev.map((i) => (i.id === cartItemId ? { ...i, quantity } : i)));
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
        setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
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
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center shadow-xs">
          <Spinner size={40} />
          <p className="mt-4 text-sm text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 cursor-pointer"
        >
          <ArrowLeft size={16} /> Continue shopping
        </button>
        <div className="h-5 w-px bg-gray-200" />
        <div className="inline-flex items-center gap-2 text-gray-900">
          <ShoppingCart size={18} className="text-indigo-600" />
          <h1 className="text-xl font-bold">
            My cart <span className="text-gray-500 font-normal">({cartItems.length})</span>
          </h1>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex min-h-[56vh] items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-xs">
          <div className="max-w-md">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-400">
              <ShoppingBag size={36} />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">Add a few products and they will show up here for review and checkout.</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 cursor-pointer shadow-sm"
            >
              <ShoppingBag size={16} /> Start shopping
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
                  className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-indigo-200 shadow-2xs"
                >
                  <Link href={`/product/${item.productId}`} className="shrink-0">
                    <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-50/50">
                      <Image src={images[0]} alt={item.product.title} fill className="object-contain p-1" sizes="96px" />
                    </div>
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${item.productId}`}>
                      <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-gray-900 transition-colors hover:text-indigo-600">
                        {item.product.title}
                      </h3>
                    </Link>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">{item.product.brand}</p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ₹{(item.product.originalPrice * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-400">Quantity {item.quantity}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            disabled={updatingId === item.id}
                            className="inline-flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-150 hover:text-gray-900 disabled:opacity-50 cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="inline-flex h-8 w-9 items-center justify-center text-sm font-semibold text-gray-900">
                            {updatingId === item.id ? (
                              <div className="h-3 w-3 animate-spin rounded-full border border-indigo-600/25 border-t-indigo-600" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            disabled={updatingId === item.id}
                            className="inline-flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-150 hover:text-gray-900 disabled:opacity-50 cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updatingId === item.id}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 cursor-pointer"
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
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900">
                <ShoppingBag size={18} className="text-indigo-600" /> Order summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-semibold text-emerald-600">-₹{savings.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className={delivery === 0 ? "font-semibold text-emerald-600" : "font-semibold text-gray-900"}>
                    {delivery === 0 ? "FREE" : `₹${delivery}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {savings > 0 && (
                <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
                  <p className="text-sm font-semibold text-emerald-700">
                    You save ₹{savings.toLocaleString("en-IN")} on this order
                  </p>
                </div>
              )}

              <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 cursor-pointer shadow-sm">
                <Zap size={16} /> Proceed to checkout
              </button>
              <Link href="/" className="mt-4 block text-center text-sm text-gray-500 transition-colors hover:text-gray-900">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


