"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Zap, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/useStore";
import { Product } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const images: string[] = JSON.parse(product.images);
  const { data: session } = useSession();
  const { openAuthModal, setCartCount, setBuyNowItem } = useStore();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const addToCart = async () => {
    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cartCount !== undefined) setCartCount(data.cartCount);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        toast.success("Added to cart!", {
          style: { background: "#1e1b4b", color: "#fff", border: "1px solid #4f46e5" },
          iconTheme: { primary: "#818cf8", secondary: "#1e1b4b" },
        });
      } else if (res.status === 403) {
        toast.error("Session expired. Please sign in again.");
      }
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) { openAuthModal(addToCart); return; }
    await addToCart();
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      openAuthModal(async () => {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.cartCount !== undefined) setCartCount(data.cartCount);
          setBuyNowItem(product.id);
          router.push("/checkout");
        }
      });
      return;
    }
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.cartCount !== undefined) setCartCount(data.cartCount);
      setBuyNowItem(product.id);
      router.push("/checkout");
    }
  };

  const discount = product.discount ?? (product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0);

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-100/60 hover:border-indigo-200">
        
        {/* Image area */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute left-3 top-3 z-10 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              -{discount}%
            </div>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
              <span className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-bold text-white">Out of Stock</span>
            </div>
          )}

          {/* Action buttons — appear on hover */}
          <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 opacity-0 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
            <button
              onClick={handleQuickAdd}
              disabled={adding || product.stock === 0}
              title="Add to cart"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-md transition-all hover:border-indigo-500 hover:bg-indigo-600 hover:text-white disabled:opacity-50 cursor-pointer"
            >
              {adding ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-300 border-t-indigo-700" />
              ) : added ? (
                <span className="text-emerald-600 text-xs font-bold">✓</span>
              ) : (
                <ShoppingCart size={14} />
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              title="Buy now"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-white text-amber-500 shadow-md transition-all hover:bg-amber-500 hover:text-white disabled:opacity-50 cursor-pointer"
            >
              <Zap size={14} />
            </button>
          </div>

          <div className="relative aspect-[4/3]">
            <Image
              src={images[0]}
              alt={product.title}
              fill
              className="object-contain p-5 transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
        </div>

        {/* Info area */}
        <div className="flex flex-1 flex-col p-4">
          {/* Brand + Category */}
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">
              {product.brand}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold text-gray-500">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 flex-1 text-sm font-semibold leading-5 text-gray-900 transition-colors group-hover:text-indigo-700">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={11}
                  className={i <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-gray-400">({product.reviewCount?.toLocaleString()})</span>
          </div>

          {/* Price row */}
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-gray-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              {product.stock > 0 && product.stock <= 5 && (
                <p className="mt-0.5 text-[11px] font-semibold text-amber-600">
                  Only {product.stock} left!
                </p>
              )}
            </div>

            {/* Free delivery chip */}
            {product.price >= 499 && (
              <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                FREE delivery
              </span>
            )}
          </div>
        </div>

        {/* Hover bottom bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 opacity-0 transition-all duration-300 group-hover:opacity-100" />
      </article>
    </Link>
  );
}
