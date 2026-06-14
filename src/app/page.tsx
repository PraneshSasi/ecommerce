"use client";

import { useEffect, useState, useCallback } from "react";
import { useStore } from "@/store/useStore";
import { Product } from "@/types";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryBar from "@/components/home/CategoryBar";
import ProductCard from "@/components/home/ProductCard";
import OffersSection from "@/components/home/OffersSection";
import ProductSlider from "@/components/home/ProductSlider";
import Spinner from "@/components/ui/Spinner";
import Image from "next/image";
import Link from "next/link";
import { PackageSearch, SlidersHorizontal, TrendingUp, ArrowUpDown } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "rating_desc", label: "Top Rated" },
  { value: "filter_budget", label: "Under ₹1,000" },
  { value: "filter_mid", label: "₹1,000 – ₹10,000" },
  { value: "filter_premium", label: "Above ₹10,000" },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lookbookItems, setLookbookItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSort, setFilterSort] = useState("featured");
  const { searchQuery, selectedCategory } = useStore();

  const revealHero = useScrollReveal();
  const revealOffers = useScrollReveal();
  const revealProducts = useScrollReveal();
  const revealSlider = useScrollReveal();
  const revealLookbook = useScrollReveal();
  const revealSlogan = useScrollReveal();

  useEffect(() => {
    async function loadLookbook() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data: Product[] = await res.json();
          const jordan = data.find(p => p.title.toLowerCase().includes("jordan"));
          const sony = data.find(p => p.title.toLowerCase().includes("wh-1000xm5") || p.title.toLowerCase().includes("sony"));
          const iphone = data.find(p => p.title.toLowerCase().includes("iphone"));
          
          const filtered = data.filter(p => p.id !== jordan?.id && p.id !== sony?.id && p.id !== iphone?.id);
          const accessory = filtered[0] || data[3];

          const items: Product[] = [];
          if (jordan) items.push(jordan);
          if (sony) items.push(sony);
          if (iphone) items.push(iphone);
          if (accessory && items.length < 4) items.push(accessory);

          while (items.length < 4 && data.length > items.length) {
            const nextItem = data.find(p => !items.includes(p));
            if (nextItem) items.push(nextItem);
            else break;
          }

          setLookbookItems(items);
        }
      } catch (err) {
        console.error("Failed to load lookbook:", err);
      }
    }
    loadLookbook();
  }, []);

  const getLookbookImage = (product: Product | undefined, fallback: string) => {
    if (!product) return fallback;
    try {
      const parsed = JSON.parse(product.images);
      return parsed[0] || fallback;
    } catch {
      return fallback;
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory);

      let sortParam = "featured";
      let priceRangeParam = "all";
      if (filterSort.startsWith("filter_")) {
        priceRangeParam = filterSort.replace("filter_", "");
      } else {
        sortParam = filterSort;
      }
      if (sortParam !== "featured") params.set("sort", sortParam);
      if (priceRangeParam !== "all") params.set("priceRange", priceRangeParam);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, filterSort]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Hero */}
        <div ref={revealHero} className="scroll-reveal">
          <HeroBanner />
        </div>

        {/* Promo strip */}
        <div className="mt-8 flex items-center gap-4 overflow-x-auto rounded-xl bg-[#0a0a0d] border border-red-950/20 px-6 py-3.5 scrollbar-hide text-xs font-black uppercase tracking-widest text-white/70 select-none">
          {[
            "🚀 Free shipping on orders above ₹499",
            "🎉 New arrivals every week",
            "🔒 100% secure payments",
            "↩️  Easy 30-day returns",
            "⚡ Lightning-fast delivery",
          ].map((text) => (
            <span key={text} className="shrink-0 flex items-center gap-1 font-mono">
              {text}
            </span>
          ))}
        </div>

        {/* Offers Section */}
        <div ref={revealOffers} className="scroll-reveal">
          <OffersSection />
        </div>

        {/* Products section */}
        <section id="products" ref={revealProducts} className="scroll-reveal relative z-10 mt-16 space-y-6">
          {/* Section header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1 select-none">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 font-mono">
                  ✦ COLLECTION WAVE 01
                </span>
              </div>
              <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight uppercase">
                {searchQuery ? `Search: ${searchQuery}` : "NEW COLLECTION"}
              </h2>
              {!loading && (
                <p className="mt-1 text-xs font-bold text-white/40 uppercase tracking-widest font-mono">
                  <span className="text-white">{products.length}</span>{" "}
                  {products.length === 1 ? "item" : "items"} available
                </p>
              )}
            </div>

            {/* Sort control */}
            <div className="flex items-center gap-2.5 rounded-xl border border-red-950/20 bg-[#0a0a0d] px-4 py-2.5 shadow-md">
              <label htmlFor="sort-filter" className="sr-only">Sort</label>
              <select
                id="sort-filter"
                value={filterSort}
                onChange={(e) => setFilterSort(e.target.value)}
                className="bg-transparent text-xs font-black uppercase tracking-wider text-white focus:outline-none cursor-pointer [&>option]:bg-[#0a0a0d] [&>option]:text-white font-mono"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category bar */}
          <CategoryBar />

          {/* Filter info pill */}
          {(searchQuery || selectedCategory !== "All" || filterSort !== "featured") && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-red-950/20 bg-white/5 px-3 py-1">
                <SlidersHorizontal size={12} className="text-white/60" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/60 font-mono">Active filters:</span>
              </div>
              {searchQuery && (
                <span className="rounded-full bg-white/5 px-3 py-1 text-[9px] font-black text-white border border-red-950/20 uppercase tracking-widest font-mono">
                  Search: {searchQuery}
                </span>
              )}
              {selectedCategory !== "All" && (
                <span className="rounded-full bg-white/5 px-3 py-1 text-[9px] font-black text-white border border-red-950/20 uppercase tracking-widest font-mono">
                  {selectedCategory}
                </span>
              )}
              {filterSort !== "featured" && (
                <span className="rounded-full bg-white/5 px-3 py-1 text-[9px] font-black text-white border border-red-950/20 uppercase tracking-widest font-mono">
                  {SORT_OPTIONS.find((o) => o.value === filterSort)?.label}
                </span>
              )}
            </div>
          )}

          {/* Product grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-red-950/20 bg-[#0a0a0d] py-32 shadow-xl">
              <Spinner size={40} />
              <p className="mt-4 text-xs font-black text-white/50 uppercase tracking-widest font-mono">LOADING CATALOG...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-red-950/20 bg-[#0a0a0d] py-32 text-center shadow-xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-white/30 border border-red-950/20">
                <PackageSearch size={36} />
              </div>
              <h3 className="mt-5 text-lg font-black text-white uppercase tracking-wider font-mono">No items found</h3>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-white/45 uppercase tracking-widest font-mono">
                Try a different search term or switch categories to discover.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Bottom padding */}
          {!loading && products.length > 0 && (
            <p className="pt-4 text-center text-[9px] uppercase tracking-[0.25em] text-white/30 font-black font-mono">
              Showing all {products.length} products · WAVE 01 updates live
            </p>
          )}
        </section>

        {/* Trending Products Slider */}
        <div ref={revealSlider} className="scroll-reveal">
          <ProductSlider products={products} />
        </div>

        {/* WAVE 01 // LOOKBOOK Lifestyle Gallery */}
        <section ref={revealLookbook} className="scroll-reveal mt-24 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-1 select-none">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">
                ✦ ARCHITECTURAL CONCEPT
              </span>
            </div>
            <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight uppercase">
              WAVE 01 // LOOKBOOK
            </h2>
            <p className="mt-1 text-xs font-bold text-white/40 uppercase tracking-widest">
              LIFESTYLE AND VISUAL STUDY DEPLOYMENT
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 perspective-3d">
            {/* Gallery Card 1 - Large Tall Card */}
            <Link 
              href={lookbookItems[0] ? `/product/${lookbookItems[0].id}` : "#"}
              className="relative group overflow-hidden rounded-[24px] border border-red-950/20 bg-black/40 backdrop-blur-md shadow-xl h-[450px] md:col-span-2 flex flex-col justify-between p-6 select-none tilt-3d-left hover:border-red-900/30 cursor-pointer block hud-corner hud-corner-bottom"
            >
              <div className="relative w-full h-2/3 rounded-2xl overflow-hidden bg-red-950/20 flex items-center justify-center p-8 [transform-style:preserve-3d]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/5 to-transparent h-1/2 w-full animate-scanline opacity-0 group-hover:opacity-100 pointer-events-none" />
                <div className="relative w-full h-full animate-3d-nike [transform-style:preserve-3d]">
                  <div className="relative w-full h-full pop-3d-image">
                    <Image
                      src={getLookbookImage(lookbookItems[0], "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80")}
                      alt={lookbookItems[0] ? lookbookItems[0].title : "Nike Jordan Sneaker"}
                      fill
                      className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]"
                      sizes="(max-w-768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
              <div className="border-t border-white/5 pt-3 font-mono flex flex-col gap-0.5 text-[9px] text-gray-400">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-white font-black uppercase truncate text-sm">{lookbookItems[0] ? lookbookItems[0].title.toUpperCase() : "NIKE AIR JORDAN 1"}</span>
                  <span className="text-red-500 font-black text-sm">{lookbookItems[0] ? `₹${lookbookItems[0].price.toLocaleString("en-IN")}` : "₹12,995"}</span>
                </div>
                <div className="flex justify-between text-[8px] text-gray-500 mt-1">
                  <span>SPEC // DVC.WAVE.01</span>
                  <span>STATUS // ONLINE</span>
                </div>
              </div>
            </Link>

            {/* Gallery Card 2 - Standard Card */}
            <Link 
              href={lookbookItems[1] ? `/product/${lookbookItems[1].id}` : "#"}
              className="relative group overflow-hidden rounded-[24px] border border-red-950/20 bg-black/40 backdrop-blur-md shadow-xl h-[450px] md:col-span-1 flex flex-col justify-between p-6 select-none tilt-3d-center hover:border-red-900/30 cursor-pointer block hud-corner hud-corner-bottom"
            >
              <div className="relative w-full h-2/3 rounded-2xl overflow-hidden bg-red-950/20 flex items-center justify-center p-6 [transform-style:preserve-3d]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/5 to-transparent h-1/2 w-full animate-scanline opacity-0 group-hover:opacity-100 pointer-events-none" />
                <div className="relative w-full h-full animate-3d-sony [transform-style:preserve-3d]">
                  <div className="relative w-full h-full pop-3d-image">
                    <Image
                      src={getLookbookImage(lookbookItems[1], "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80")}
                      alt={lookbookItems[1] ? lookbookItems[1].title : "Sony Headphones"}
                      fill
                      className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]"
                      sizes="(max-w-768px) 100vw, 25vw"
                    />
                  </div>
                </div>
              </div>
              <div className="border-t border-white/5 pt-3 font-mono flex flex-col gap-0.5 text-[9px] text-gray-400">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-white font-black uppercase truncate text-sm">{lookbookItems[1] ? lookbookItems[1].title.toUpperCase() : "SONY HEADPHONES"}</span>
                  <span className="text-red-500 font-black text-sm">{lookbookItems[1] ? `₹${lookbookItems[1].price.toLocaleString("en-IN")}` : "₹24,990"}</span>
                </div>
                <div className="flex justify-between text-[8px] text-gray-500 mt-1">
                  <span>SPEC // DVC.WAVE.02</span>
                  <span>STATUS // ONLINE</span>
                </div>
              </div>
            </Link>

            {/* Right Column: Stack of two cards */}
            <div className="flex flex-col gap-6 md:col-span-1">
              {/* Gallery Card 3 */}
              <Link 
                href={lookbookItems[2] ? `/product/${lookbookItems[2].id}` : "#"}
                className="relative group overflow-hidden rounded-[24px] border border-red-950/20 bg-black/40 backdrop-blur-md shadow-xl h-[213px] flex items-center gap-4 p-4 select-none tilt-3d-right hover:border-red-900/30 cursor-pointer block hud-corner hud-corner-bottom"
              >
                <div className="relative w-1/2 h-full rounded-xl overflow-hidden bg-red-950/20 flex items-center justify-center p-2 [transform-style:preserve-3d]">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/5 to-transparent h-1/2 w-full animate-scanline opacity-0 group-hover:opacity-100 pointer-events-none" />
                  <div className="relative w-full h-full animate-3d-apple [transform-style:preserve-3d]">
                    <div className="relative w-full h-full pop-3d-image">
                      <Image
                        src={getLookbookImage(lookbookItems[2], "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80")}
                        alt={lookbookItems[2] ? lookbookItems[2].title : "Apple iPhone"}
                        fill
                        className="object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)]"
                        sizes="15vw"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0 font-mono text-[9px] text-gray-400">
                  <span className="text-[8px] font-black uppercase tracking-[0.25em] text-red-500">03 / DEVICE</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white mt-1 truncate">
                    {lookbookItems[2] ? lookbookItems[2].title.toUpperCase() : "IPHONE 15 PRO"}
                  </h3>
                  <p className="text-[9px] font-bold text-red-500 mt-1">{lookbookItems[2] ? `₹${lookbookItems[2].price.toLocaleString("en-IN")}` : "₹1,29,900"}</p>
                  <p className="text-[7px] text-gray-500 mt-1 uppercase tracking-wider">SPEC // DVC.WAVE.03</p>
                </div>
              </Link>

              {/* Gallery Card 4 */}
              <Link 
                href={lookbookItems[3] ? `/product/${lookbookItems[3].id}` : "#"}
                className="relative group overflow-hidden rounded-[24px] border border-red-950/20 bg-black/40 backdrop-blur-md shadow-xl h-[213px] flex items-center gap-4 p-4 select-none tilt-3d-right hover:border-red-900/30 cursor-pointer block hud-corner hud-corner-bottom"
              >
                <div className="relative w-1/2 h-full rounded-xl overflow-hidden bg-red-950/20 flex items-center justify-center p-2 [transform-style:preserve-3d]">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/5 to-transparent h-1/2 w-full animate-scanline opacity-0 group-hover:opacity-100 pointer-events-none" />
                  <div className="relative w-full h-full animate-3d-sony [transform-style:preserve-3d]">
                    <div className="relative w-full h-full pop-3d-image">
                      <Image
                        src={getLookbookImage(lookbookItems[3], "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80")}
                        alt={lookbookItems[3] ? lookbookItems[3].title : "Smartwatch"}
                        fill
                        className="object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)]"
                        sizes="15vw"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0 font-mono text-[9px] text-gray-400">
                  <span className="text-[8px] font-black uppercase tracking-[0.25em] text-red-500">04 / ACCESSORY</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white mt-1 truncate">
                    {lookbookItems[3] ? lookbookItems[3].title.toUpperCase() : "SMARTWATCH 4"}
                  </h3>
                  <p className="text-[9px] font-bold text-red-500 mt-1">{lookbookItems[3] ? `₹${lookbookItems[3].price.toLocaleString("en-IN")}` : "₹8,990"}</p>
                  <p className="text-[7px] text-gray-500 mt-1 uppercase tracking-wider">SPEC // DVC.WAVE.04</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom Artic Slogan & Mountain Section */}
        <section 
          ref={revealSlogan}
          className="scroll-reveal relative overflow-hidden rounded-[32px] border border-red-950/35 shadow-2xl min-h-[420px] flex items-end bg-cover bg-center mt-20 p-8 md:p-12 hud-corner group"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486873249359-2731bd6dafc7?w=1600&q=80')" }}
        >
          {/* Dark glowing cyberpunk overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/95 to-red-950/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/70 to-transparent opacity-90" />

          {/* SVG HUD Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 opacity-40 group-hover:opacity-75 transition-opacity duration-500">
            <svg className="absolute inset-0 w-full h-full text-red-500/20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="slogan-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="0.8" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#slogan-grid)" />
              
              {/* Concentric telemetry circles */}
              <circle cx="75%" cy="40%" r="200" className="stroke-current stroke-[0.5] fill-none animate-rotate-slow" strokeDasharray="4, 12" />
              <circle cx="75%" cy="40%" r="140" className="stroke-current stroke-1 fill-none animate-rotate-reverse-slow" strokeDasharray="1, 8" />
              <circle cx="75%" cy="40%" r="80" className="stroke-current stroke-[0.75] fill-none animate-pulse" />
              
              {/* Crosshairs & Scope */}
              <line x1="75%" y1="0" x2="75%" y2="100%" className="stroke-current stroke-[0.5]" strokeDasharray="2, 8" />
              <line x1="0" y1="40%" x2="100%" y2="40%" className="stroke-current stroke-[0.5]" strokeDasharray="2, 8" />
              
              {/* Scanning sweep */}
              <line x1="0" y1="0" x2="100%" y2="100%" className="stroke-current stroke-[0.25]" opacity="0.3" />
            </svg>

            {/* Float details */}
            <div className="absolute top-[8%] left-[5%] text-[7px] font-mono text-red-500/60 uppercase tracking-widest animate-pulse">
              [LAT_02 // SYSTEM_ONLINE // COORD: 68.2524° N]
            </div>
            <div className="absolute top-[8%] right-[5%] text-[7px] font-mono text-red-500/60 uppercase tracking-widest">
              SYS // LOC_SCAN_SECTOR: 09_C
            </div>
            <div className="absolute bottom-[20%] right-[32%] text-[7px] font-mono text-red-500/40 uppercase tracking-widest animate-glow-pulse">
              ELEVATION: 2,460M // TEMP: -14°C
            </div>
          </div>

          {/* Giant stenciled background logo */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden z-0">
            <span className="text-[12rem] sm:text-[18rem] md:text-[24rem] lg:text-[30rem] font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white/5 to-transparent select-none font-sans stroke-[1.5] stroke-red-900/10">
              WAVE
            </span>
          </div>

          <div className="relative w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-end z-10 text-white">
            {/* Left brand description */}
            <div className="md:col-span-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 leading-relaxed max-w-xs select-none font-mono">
              <p className="text-white mb-2 tracking-[0.25em] font-black font-mono">✦ PRODUCT DESIGN // ARCHIVE</p>
              ALL PRODUCTS ARE
              <br />
              FORGED WITH DURABLE,
              <br />
              WEATHER-RESISTANT FIBERS,
              <br />
              MADE FOR EVERYDAY WEAR.
            </div>

            {/* Middle large slogan */}
            <div className="md:col-span-5 flex flex-col justify-end">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[1.05] tracking-wider font-mono">
                CRAFTED FOR PEAKS
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ea580c] to-[#f59e0b]">DESIGNED FOR STREETS</span>
                <br />
                SHIPPED WORLDWIDE
              </h3>
              <div className="mt-4 flex flex-wrap gap-4 text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                <span>[ SHIPPED // GLOBAL_FAST ]</span>
                <span>[ SECURE // SSL_VERIFIED ]</span>
                <span>[ GUARANTEE // 30_DAYS ]</span>
              </div>
            </div>

            {/* Right barcode graphic */}
            <div className="md:col-span-3 flex justify-end select-none opacity-40 hover:opacity-80 transition-opacity">
              <svg viewBox="0 0 200 60" className="w-40 h-auto fill-current text-white">
                <rect x="0" y="0" width="4" height="60" />
                <rect x="8" y="0" width="2" height="60" />
                <rect x="14" y="0" width="6" height="60" />
                <rect x="24" y="0" width="2" height="60" />
                <rect x="30" y="0" width="4" height="60" />
                <rect x="38" y="0" width="8" height="60" />
                <rect x="50" y="0" width="2" height="60" />
                <rect x="56" y="0" width="6" height="60" />
                <rect x="66" y="0" width="4" height="60" />
                <rect x="74" y="0" width="2" height="60" />
                <rect x="80" y="0" width="8" height="60" />
                <rect x="92" y="0" width="2" height="60" />
                <rect x="98" y="0" width="4" height="60" />
                <rect x="106" y="0" width="6" height="60" />
                <rect x="116" y="0" width="2" height="60" />
                <rect x="122" y="0" width="8" height="60" />
                <rect x="134" y="0" width="4" height="60" />
                <rect x="142" y="0" width="2" height="60" />
                <rect x="148" y="0" width="6" height="60" />
                <rect x="158" y="0" width="2" height="60" />
                <rect x="164" y="0" width="8" height="60" />
                <rect x="176" y="0" width="4" height="60" />
                <rect x="184" y="0" width="2" height="60" />
                <rect x="190" y="0" width="6" height="60" />
              </svg>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
