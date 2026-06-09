"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({ rating, reviewCount, size = "sm" }: StarRatingProps) {
  const sizeMap = { sm: 12, md: 16, lg: 20 };
  const px = sizeMap[size];

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={px}
            className={
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      <span className={`text-amber-400 font-semibold ${size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"}`}>
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className={`text-gray-400 ${size === "sm" ? "text-xs" : "text-sm"}`}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
