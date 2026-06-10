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
    <Link href={`/product/${product.id}`} className="group block h-full select-none">
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#cbd5e1] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/25">
        
        {/* Image area */}
        <div className="relative overflow-hidden bg-[#cbd5e1] p-4 flex items-center justify-center">
          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute left-3 top-3 z-10 rounded-full bg-zinc-950 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-widest">
              -{discount}%
            </div>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-xs">
              <span className="rounded-lg bg-zinc-900 px-3 py-1.5 text-[10px] font-black text-white uppercase tracking-wider">OUT OF STOCK</span>
            </div>
          )}

          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white/10 flex items-center justify-center p-2">
            <div className="relative w-full h-full mix-blend-multiply">
              <Image
                src={images[0]}
                alt={product.title}
                fill
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 25vw"
              />
            </div>
          </div>
        </div>

        {/* Info area */}
        <div className="flex flex-1 flex-col p-5 bg-[#cbd5e1]">
          {/* Brand */}
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-950/50">
            {product.brand}
          </span>

          {/* Title */}
          <h3 className="line-clamp-2 flex-1 text-xs font-black uppercase tracking-tight text-zinc-950 mt-1 leading-normal group-hover:text-zinc-900">
            {product.title}
          </h3>

          {/* Mockup Color swatches */}
          <div className="mt-3 flex items-center gap-1.5 text-[8px] font-black text-zinc-950/60 uppercase tracking-widest select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-white border border-zinc-950/15" />
            <span>WHITE</span>
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
            <span>BLACK</span>
          </div>

          {/* Price row */}
          <div className="mt-4 flex items-baseline gap-2 pt-3 border-t border-zinc-950/5">
            <span className="text-sm font-black text-zinc-950">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[10px] text-zinc-950/40 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {/* Hover highlight bar */}
        <div className="h-1 w-full bg-zinc-950 opacity-0 transition-all duration-300 group-hover:opacity-100" />
      </article>
    </Link>
  );
}
