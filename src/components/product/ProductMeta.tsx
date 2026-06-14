"use client";

import { CheckCircle, XCircle, Tag, Award } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { Product } from "@/types";

interface ProductMetaProps {
  product: Product;
}

export default function ProductMeta({ product }: ProductMetaProps) {
  const discountedAmount = product.originalPrice - product.price;

  return (
    <div className="space-y-5 text-white">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-red-950/30 bg-red-950/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-red-500 font-mono">
          {product.brand}
        </span>
        <span className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
          {product.category}
        </span>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-black leading-tight text-white md:text-4xl uppercase tracking-tight font-mono">
          {product.title}
        </h1>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
      </div>

      <div className="rounded-xl border border-red-950/20 bg-red-950/5 p-5 shadow-xs">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-black text-white font-mono">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-lg text-gray-500 line-through font-mono">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
          {product.discount > 0 && (
            <span className="rounded-full border border-red-950/30 bg-red-950/25 px-2.5 py-1 text-xs font-bold text-red-500 shadow-2xs font-mono">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {discountedAmount > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm font-bold text-red-500 font-mono">
            <Tag size={14} /> YOU SAVE ₹{discountedAmount.toLocaleString("en-IN")}
          </div>
        )}
        <p className="mt-2 text-xs text-gray-500 font-mono">Inclusive of all taxes</p>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-red-950/20 bg-[#0c0c0f] px-4 py-3 shadow-2xs">
        {product.stock > 0 ? (
          <>
            <CheckCircle size={18} className="text-red-500" />
            <span className="text-sm font-semibold text-red-500 font-mono uppercase tracking-wider">
              {product.stock < 10 ? `Only ${product.stock} left in stock.` : "In stock and ready to ship."}
            </span>
          </>
        ) : (
          <>
            <XCircle size={18} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider font-mono">Out of stock</span>
          </>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white font-mono">
          <Award size={16} className="text-red-500" /> About this product
        </h2>
        <p className="text-sm leading-7 text-gray-300 font-mono uppercase tracking-wide">{product.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-white/5 overflow-hidden rounded-xl border border-white/5">
        {[
          { label: "Brand", value: product.brand },
          { label: "Category", value: product.category },
          { label: "Rating", value: `${product.rating}/5` },
          { label: "Reviews", value: product.reviewCount.toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#0a0a0c] p-4 text-center">
            <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold font-mono">{label}</p>
            <p className="mt-1 text-xs font-black uppercase text-white font-mono">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
