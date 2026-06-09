"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/useStore";
import { Product } from "@/types";
import StarRating from "@/components/ui/StarRating";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const images: string[] = JSON.parse(product.images);
  const { data: session } = useSession();
  const { openAuthModal, incrementCart } = useStore();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      openAuthModal(async () => {
        await addToCart();
      });
      return;
    }
    await addToCart();
  };

  const addToCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.ok) {
        incrementCart();
        toast.success("Added to cart!", {
          style: { background: "#ffffff", color: "#1f2937", border: "1px solid #e5e7eb" },
          iconTheme: { primary: "#4f46e5", secondary: "#fff" },
        });
      }
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md">
        <div className="relative overflow-hidden border-b border-gray-100 bg-gray-50/50">
          {product.discount > 0 && (
            <div className="absolute left-3 top-3 z-10 rounded-md bg-green-600 px-2 py-1 text-[11px] font-bold text-white shadow-xs">
              {product.discount}% OFF
            </div>
          )}

          <button
            onClick={handleQuickAdd}
            className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 opacity-0 transition-all duration-200 hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 group-hover:opacity-100 shadow-xs cursor-pointer"
            title="Quick add to cart"
          >
            <ShoppingCart size={14} />
          </button>

          <div className="relative aspect-[4/3]">
            <Image
              src={images[0]}
              alt={product.title}
              fill
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">{product.brand}</p>
            <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-500">
              {product.category}
            </span>
          </div>

          <h3 className="min-h-[3rem] text-sm font-semibold leading-6 text-gray-950 transition-colors group-hover:text-indigo-600 line-clamp-2">
            {product.title}
          </h3>

          <div className="mt-3">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
          </div>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              {product.stock < 10 && product.stock > 0 && (
                <p className="mt-1 text-xs font-medium text-amber-600">Only {product.stock} left</p>
              )}
              {product.stock === 0 && (
                <p className="mt-1 text-xs font-medium text-rose-600">Out of stock</p>
              )}
            </div>

            <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
              View <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

