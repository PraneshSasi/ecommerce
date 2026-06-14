"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Product } from "@/types";

import "swiper/css";
import "swiper/css/navigation";

interface ProductSliderProps {
  products: Product[];
}

export default function ProductSlider({ products }: ProductSliderProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-16 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1 select-none">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 font-mono">
              ✦ TRENDING // WAVE 01
            </span>
          </div>
          <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight uppercase">
            TRENDING NOW
          </h2>
          <p className="mt-1 text-xs font-bold text-white/40 uppercase tracking-widest font-mono">
            TOP PICKS THIS WEEK
          </p>
        </div>

        {/* Custom navigation arrows */}
        <div className="flex items-center gap-2">
          <button
            className="slider-prev flex h-9 w-9 items-center justify-center rounded-lg border border-red-950/30 bg-[#0a0a0c] text-white/60 transition-all duration-300 hover:border-red-900/40 hover:bg-red-950/20 hover:text-white cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="slider-next flex h-9 w-9 items-center justify-center rounded-lg border border-red-950/30 bg-[#0a0a0c] text-white/60 transition-all duration-300 hover:border-red-900/40 hover:bg-red-950/20 hover:text-white cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Swiper Carousel */}
      <div className="relative">
        <Swiper
          modules={[Autoplay, Navigation]}
          slidesPerView={1.2}
          spaceBetween={16}
          loop={products.length > 5}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: ".slider-prev",
            nextEl: ".slider-next",
          }}
          breakpoints={{
            640: { slidesPerView: 2.5 },
            768: { slidesPerView: 3.5 },
            1024: { slidesPerView: 4.5 },
          }}
          className="!overflow-visible"
        >
          {products.map((product) => {
            const images: string[] = JSON.parse(product.images);
            const discount =
              product.discount ??
              (product.originalPrice > product.price
                ? Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )
                : 0);

            return (
              <SwiperSlide key={product.id}>
                <Link
                  href={`/product/${product.id}`}
                  className="group block h-full select-none"
                >
                  <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0c] transition-all duration-500 hover:shadow-2xl hover:shadow-black/40 hover:border-red-950/30">
                    {/* Image area */}
                    <div className="relative overflow-hidden p-4 flex items-center justify-center">
                      {/* Discount badge */}
                      {discount > 0 && (
                        <div className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-black font-mono text-white uppercase tracking-widest">
                          -{discount}%
                        </div>
                      )}

                      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-red-950/5 border border-red-950/20 flex items-center justify-center p-2">
                        <div className="relative w-full h-full">
                          <Image
                            src={images[0]}
                            alt={product.title}
                            fill
                            className="object-contain p-2 transition-transform duration-500 drop-shadow-[0_8px_15px_rgba(0,0,0,0.3)] group-hover:scale-105 group-hover:drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)]"
                            sizes="(max-width: 640px) 80vw, (max-width: 768px) 40vw, (max-width: 1024px) 28vw, 22vw"
                          />
                        </div>
                      </div>

                      {/* Scanline on hover */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/5 to-transparent h-1/2 w-full animate-scanline opacity-0 group-hover:opacity-100 pointer-events-none" />
                    </div>

                    {/* Info area */}
                    <div className="flex flex-1 flex-col p-4 pt-0">
                      {/* Title */}
                      <h3 className="line-clamp-2 text-xs font-black uppercase tracking-tight text-white leading-normal group-hover:text-white/90 font-mono">
                        {product.title}
                      </h3>

                      {/* Metadata grid */}
                      <div className="grid grid-cols-2 border-y border-white/5 py-2.5 my-3 text-center">
                        <div className="border-r border-white/5 px-1 min-w-0">
                          <span className="block text-[8px] uppercase tracking-widest text-white/30 font-mono">
                            BRAND
                          </span>
                          <span className="block text-[9px] font-black uppercase text-white truncate font-mono mt-0.5">
                            {product.brand}
                          </span>
                        </div>
                        <div className="px-1 min-w-0">
                          <span className="block text-[8px] uppercase tracking-widest text-white/30 font-mono">
                            PRICE
                          </span>
                          <span className="block text-[9px] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#e11d48] to-[#fda4af] font-mono mt-0.5">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Bottom row */}
                      <div className="flex items-center justify-between mt-auto pt-1">
                        <div>
                          <span className="block text-[8px] uppercase tracking-widest text-white/30 font-mono">
                            POPULARITY
                          </span>
                          <span className="block text-sm font-black text-white font-mono leading-none mt-0.5">
                            {(product.rating * 20).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black hover:bg-red-600 hover:text-white transition-colors cursor-pointer shadow-sm">
                          <span className="text-[10px] font-black font-mono">
                            →
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hover highlight bar */}
                    <div className="h-1 w-full bg-red-600 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                  </article>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Bottom telemetry line */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-950/30 to-transparent" />
        <span className="text-[7px] font-mono text-white/20 uppercase tracking-[0.3em] select-none">
          [ TREND_MODULE // {products.length} ITEMS // AUTO_SCROLL ]
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-950/30 to-transparent" />
      </div>
    </section>
  );
}
