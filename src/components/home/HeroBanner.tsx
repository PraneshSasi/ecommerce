"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function HeroBanner() {
  return (
    <div className="w-full space-y-6">
      
      {/* 1. Giant text block at the top */}
      <div className="w-full text-center py-4 md:py-8 lg:py-10">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-none text-black select-none font-sans">
          FEEL THE VIBES
        </h1>
      </div>

      {/* 2. Horizontal ticker marquee tape */}
      <div className="w-full bg-black text-white py-3.5 overflow-hidden select-none border-y border-black rounded-lg">
        <div className="flex whitespace-nowrap">
          <div className="animate-ticker inline-flex items-center gap-12 font-black uppercase tracking-[0.25em] text-xs sm:text-sm">
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
          </div>
          <div className="animate-ticker inline-flex items-center gap-12 font-black uppercase tracking-[0.25em] text-xs sm:text-sm" aria-hidden="true">
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
          </div>
        </div>
      </div>

      {/* 3. Main gradient banner with central model & floating cards */}
      <section className="relative overflow-hidden rounded-[32px] bg-loco-gradient shadow-xl min-h-[520px] md:min-h-[580px] lg:min-h-[640px] flex items-center">
        
        {/* Background glow or subtle highlights */}
        <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.1) 100%)" />
        
        <div className="relative mx-auto w-full max-w-screen-2xl px-6 py-12 md:px-12 md:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headline and pill CTA button */}
          <div className="lg:col-span-6 z-10 flex flex-col justify-center text-white">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight uppercase mb-4 max-w-lg">
              Get ready for new season with Loco
            </h2>
            <p className="max-w-md text-sm md:text-base text-white/85 leading-relaxed mb-8">
              Loco brings something new this season, specially designed for every style you need. Discover fresh puffers, active gear, and accessories.
            </p>

            <div>
              <Link
                href="#products"
                className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-bold text-white uppercase tracking-wider transition-all duration-200 hover:bg-zinc-800 hover:-translate-y-0.5 shadow-md shadow-black/20"
              >
                Explore Items
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Right Column: Central model with yellow puffer jacket & floating cards */}
          <div className="lg:col-span-6 relative flex justify-center items-center h-[400px] md:h-[480px] lg:h-[540px] z-10 w-full mt-8 lg:mt-0">
            
            {/* Main Puffer Model Image Container */}
            <div className="relative w-[260px] h-[340px] md:w-[320px] md:h-[420px] lg:w-[380px] lg:h-[500px] overflow-hidden rounded-[32px] border-4 border-white shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
              <Image
                src="https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&q=80&w=700"
                alt="Loco Puffer Model"
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-w-md) 100vw, 380px"
              />
            </div>

            {/* Floating Card 1: Top-Left */}
            <div className="absolute top-4 left-2 md:left-6 lg:left-0 z-20 w-28 md:w-36 overflow-hidden rounded-2xl border-2 border-white bg-white/20 backdrop-blur-md p-1.5 shadow-lg transform -rotate-6 transition-all duration-300 hover:rotate-0 hover:-translate-y-1">
              <div className="relative h-20 md:h-28 rounded-xl overflow-hidden mb-1 bg-zinc-100">
                <Image
                  src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=250"
                  alt="New Arrival Fit"
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
              <p className="text-[9px] md:text-[10px] font-bold text-black text-center py-0.5 bg-white/80 rounded-lg uppercase tracking-wider">
                New Arrival
              </p>
            </div>

            {/* Floating Card 2: Bottom-Right */}
            <div className="absolute bottom-4 right-2 md:right-6 lg:right-0 z-20 w-28 md:w-36 overflow-hidden rounded-2xl border-2 border-white bg-white/20 backdrop-blur-md p-1.5 shadow-lg transform rotate-6 transition-all duration-300 hover:rotate-0 hover:-translate-y-1">
              <div className="relative h-20 md:h-28 rounded-xl overflow-hidden mb-1 bg-zinc-100">
                <Image
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250"
                  alt="New Arrival Fit"
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
              <p className="text-[9px] md:text-[10px] font-bold text-black text-center py-0.5 bg-white/80 rounded-lg uppercase tracking-wider">
                New Arrival
              </p>
            </div>

          </div>

        </div>

      </section>
    </div>
  );
}
