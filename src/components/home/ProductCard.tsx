"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Zap, Star, Heart, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/useStore";
import { useWishlist } from "@/store/useWishlist";
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
  const { openAuthModal, setCartCount, setBuyNowItem, openQuickView } = useStore();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    if (isWishlisted(product.id)) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist!");
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

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
          style: { background: "#ffffff", color: "#000000", border: "1px solid #e4e4e7" },
          iconTheme: { primary: "#ea580c", secondary: "#ffffff" },
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
    <Link href={`/product/${product.id}`} className="group block h-full select-none perspective-3d">
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0c] transition-all duration-500 hover:shadow-2xl hover:shadow-black/40 hover:border-red-950/30 tilt-3d-center">
        
        {/* Image area */}
        <div className="relative overflow-hidden p-4 flex items-center justify-center [transform-style:preserve-3d]">
          {/* Top-right Actions (Wishlist & Quick View) */}
          <div className="absolute right-3 top-3 z-20 flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistClick}
              className={`flex h-8 w-8 items-center justify-center rounded-full border bg-black/60 backdrop-blur-xs transition-all cursor-pointer ${
                isWishlisted(product.id)
                  ? "border-red-500 text-red-500"
                  : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart size={14} className={isWishlisted(product.id) ? "fill-red-500" : ""} />
            </button>

            {/* Quick View Button */}
            <button
              onClick={handleQuickViewClick}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/50 backdrop-blur-xs transition-all hover:border-white/30 hover:text-white cursor-pointer"
              aria-label="Quick view"
            >
              <Eye size={14} />
            </button>
          </div>

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-black font-mono text-white uppercase tracking-widest">
              -{discount}%
            </div>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-xs">
              <span className="rounded-lg bg-red-950 border border-red-900/30 px-3 py-1.5 text-[10px] font-black text-white/60 uppercase tracking-wider font-mono">OUT OF STOCK</span>
            </div>
          )}

          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-red-950/5 border border-red-950/20 flex items-center justify-center p-2 [transform-style:preserve-3d]">
            <div className="relative w-full h-full pop-3d-image">
              <Image
                src={images[0]}
                alt={product.title}
                fill
                className="object-contain p-2 transition-transform duration-500 drop-shadow-[0_8px_15px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)]"
                sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 25vw"
              />
            </div>
          </div>
        </div>

        {/* Info area */}
        <div className="flex flex-1 flex-col p-4">
          {/* Title */}
          <h3 className="line-clamp-2 text-xs font-black uppercase tracking-tight text-white leading-normal group-hover:text-white/90 font-mono">
            {product.title}
          </h3>

          {/* Divided Metadata Grid columns */}
          <div className="grid grid-cols-3 border-y border-white/5 py-2.5 my-3 text-center">
            <div className="border-r border-white/5 px-1 min-w-0">
              <span className="block text-[8px] uppercase tracking-widest text-white/30 font-mono">BRAND</span>
              <span className="block text-[9px] font-black uppercase text-white truncate font-mono mt-0.5">{product.brand}</span>
            </div>
            <div className="border-r border-white/5 px-1 min-w-0">
              <span className="block text-[8px] uppercase tracking-widest text-white/30 font-mono">CATEGORY</span>
              <span className="block text-[9px] font-black uppercase text-white truncate font-mono mt-0.5">{product.category}</span>
            </div>
            <div className="px-1 min-w-0">
              <span className="block text-[8px] uppercase tracking-widest text-white/30 font-mono">PRICE</span>
              <span className="block text-[9px] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#e11d48] to-[#fda4af] font-mono mt-0.5">₹{product.price.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Popularity and Arrow Button */}
          <div className="flex items-center justify-between mt-auto pt-1">
            <div>
              <span className="block text-[8px] uppercase tracking-widest text-white/30 font-mono">POPULARITY</span>
              <span className="block text-sm font-black text-white font-mono leading-none mt-0.5">
                {(product.rating * 20).toFixed(1)}%
              </span>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black hover:bg-red-600 hover:text-white transition-colors cursor-pointer shadow-sm">
              <span className="text-[10px] font-black font-mono">→</span>
            </div>
          </div>
        </div>

        {/* Hover highlight bar */}
        <div className="h-1 w-full bg-red-600 opacity-0 transition-all duration-300 group-hover:opacity-100" />
      </article>
    </Link>
  );
}
