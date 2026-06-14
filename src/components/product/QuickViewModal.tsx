"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { X, Star, ShoppingCart, Zap, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";

export default function QuickViewModal() {
  const { data: session } = useSession();
  const { quickViewProduct, closeQuickView, openAuthModal, setCartCount, setBuyNowItem } = useStore();
  const router = useRouter();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [adding, setAdding] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset active image index when product changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [quickViewProduct]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && quickViewProduct) {
        closeQuickView();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [quickViewProduct, closeQuickView]);

  // Prevent body scroll when open
  useEffect(() => {
    if (quickViewProduct) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const images: string[] = JSON.parse(product.images);
  const discount = product.discount ?? (product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0);

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
        toast.success("Added to cart!", {
          style: { background: "#ffffff", color: "#000000", border: "1px solid #e4e4e7" },
          iconTheme: { primary: "#ea580c", secondary: "#ffffff" },
        });
        closeQuickView();
      } else if (res.status === 403) {
        toast.error("Session expired. Please sign in again.");
      }
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleAddToCart = async () => {
    if (!session) {
      closeQuickView();
      openAuthModal(addToCart);
      return;
    }
    await addToCart();
  };

  const handleBuyNow = async () => {
    const buyAction = async () => {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cartCount !== undefined) setCartCount(data.cartCount);
        setBuyNowItem(product.id);
        closeQuickView();
        router.push("/checkout");
      } else {
        toast.error("Failed to proceed to checkout");
      }
    };

    if (!session) {
      closeQuickView();
      openAuthModal(buyAction);
      return;
    }
    await buyAction();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeQuickView();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-red-950/20 bg-[#0a0a0c] text-white shadow-2xl animate-scale-in"
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/60 p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Layout */}
        <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
          
          {/* Left Column: Images */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex items-center justify-center">
              {discount > 0 && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-black font-mono text-white uppercase tracking-widest">
                  -{discount}%
                </span>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-xs">
                  <span className="rounded-lg bg-red-950 border border-red-900/30 px-3 py-1.5 text-[10px] font-black text-white/60 uppercase tracking-wider font-mono">
                    OUT OF STOCK
                  </span>
                </div>
              )}
              <div className="relative h-full w-full">
                <Image
                  src={images[activeImageIndex] || "/placeholder.jpg"}
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="(max-w-768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Thumbnails if multiple images */}
            {images.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-12 w-12 overflow-hidden rounded-lg border bg-white/[0.02] p-1 cursor-pointer transition-all ${
                      idx === activeImageIndex ? "border-red-650" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} thumbnail ${idx}`}
                      fill
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 text-[9px] uppercase tracking-widest font-mono text-white/40 mb-3">
                <span className="rounded-full border border-red-950/30 bg-white/5 px-2.5 py-0.5 font-bold">
                  {product.brand}
                </span>
                <span className="rounded-full border border-red-950/30 bg-white/5 px-2.5 py-0.5 font-bold">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-black uppercase tracking-tight text-white font-mono md:text-2xl">
                {product.title}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-2.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < Math.floor(product.rating)
                          ? "fill-red-500 text-red-500"
                          : "text-white/20"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-white/50 font-mono mt-0.5">
                  {product.rating.toFixed(1)} / 5.0
                </span>
              </div>

              {/* Prices */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#e11d48] to-[#fda4af] font-mono">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-white/40 line-through font-mono">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-4 text-sm text-white/50 leading-relaxed line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 mt-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || adding}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ShoppingCart size={14} /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-700 to-red-650 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Zap size={14} /> Buy Now
                </button>
              </div>

              <Link
                href={`/product/${product.id}`}
                onClick={closeQuickView}
                className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors py-2 group/link"
              >
                VIEW FULL DETAILS
                <ArrowRight size={12} className="transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
