"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-3 group">
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
        <div className="relative aspect-square">
          <Image
            src={images[activeIndex]}
            alt={`${title} - view ${activeIndex + 1}`}
            fill
            className="object-contain p-5 transition-all duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md border border-gray-200 bg-white/95 text-gray-700 opacity-0 transition-all hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 group-hover:opacity-100 shadow-sm cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md border border-gray-200 bg-white/95 text-gray-700 opacity-0 transition-all hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 group-hover:opacity-100 shadow-sm cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full border border-gray-200 bg-white/90 px-2 py-1 backdrop-blur-xs shadow-xs">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${i === activeIndex ? "w-5 bg-indigo-600" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
            />
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square overflow-hidden rounded-md border transition-all cursor-pointer ${
                i === activeIndex
                  ? "border-indigo-600 ring-1 ring-indigo-600/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                className="object-contain bg-gray-50 p-2"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

