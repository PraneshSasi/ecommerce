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
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">
          {product.brand}
        </span>
        <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
          {product.category}
        </span>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
          {product.title}
        </h1>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 shadow-xs">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-bold text-gray-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-lg text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
          {product.discount > 0 && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 shadow-2xs">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {discountedAmount > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Tag size={14} /> You save ₹{discountedAmount.toLocaleString("en-IN")}
          </div>
        )}
        <p className="mt-2 text-xs text-gray-400">Inclusive of all taxes</p>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-2xs">
        {product.stock > 0 ? (
          <>
            <CheckCircle size={18} className="text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">
              {product.stock < 10 ? `Only ${product.stock} left in stock.` : "In stock and ready to ship."}
            </span>
          </>
        ) : (
          <>
            <XCircle size={18} className="text-rose-600" />
            <span className="text-sm font-semibold text-rose-700">Out of stock</span>
          </>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-gray-900">
          <Award size={16} className="text-primary-600" /> About this product
        </h2>
        <p className="text-sm leading-7 text-gray-700">{product.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Brand", value: product.brand },
          { label: "Category", value: product.category },
          { label: "Rating", value: `${product.rating}/5` },
          { label: "Reviews", value: product.reviewCount.toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-gray-50/30 p-3 shadow-2xs">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400">{label}</p>
            <p className="mt-1 text-sm font-bold text-gray-950">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
