"use client";

import { useEffect, useState, useCallback } from "react";
import { useStore } from "@/store/useStore";
import { Product } from "@/types";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryBar from "@/components/home/CategoryBar";
import ProductCard from "@/components/home/ProductCard";
import Spinner from "@/components/ui/Spinner";
import { PackageSearch, SlidersHorizontal, TrendingUp, ArrowUpDown } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [filterSort, setFilterSort] = useState("featured");
  const { searchQuery, selectedCategory } = useStore();

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
    <div className="min-h-screen bg-[#1b222a] text-white">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Hero */}
        <HeroBanner />

        {/* Promo strip */}
        <div className="mt-8 flex items-center gap-4 overflow-x-auto rounded-xl bg-[#222b35] border border-white/5 px-6 py-3.5 scrollbar-hide text-xs font-black uppercase tracking-widest text-white/70 select-none">
          {[
            "🚀 Free shipping on orders above ₹499",
            "🎉 New arrivals every week",
            "🔒 100% secure payments",
            "↩️  Easy 30-day returns",
            "⚡ Lightning-fast delivery",
          ].map((text) => (
            <span key={text} className="shrink-0 flex items-center gap-1">
              {text}
            </span>
          ))}
        </div>

        {/* Products section */}
        <section id="products" className="relative z-10 mt-16 space-y-6">
          {/* Section header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1 select-none">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">
                  ✦ COLLECTION WAVE 01
                </span>
              </div>
              <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight uppercase">
                {searchQuery ? `Search: ${searchQuery}` : "NEW COLLECTION"}
              </h2>
              {!loading && (
                <p className="mt-1 text-xs font-bold text-white/40 uppercase tracking-widest">
                  <span className="text-white">{products.length}</span>{" "}
                  {products.length === 1 ? "item" : "items"} available
                </p>
              )}
            </div>

            {/* Sort control */}
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#222b35] px-4 py-2.5 shadow-md">
              <label htmlFor="sort-filter" className="sr-only">Sort</label>
              <select
                id="sort-filter"
                value={filterSort}
                onChange={(e) => setFilterSort(e.target.value)}
                className="bg-transparent text-xs font-black uppercase tracking-wider text-white focus:outline-none cursor-pointer [&>option]:bg-[#222b35] [&>option]:text-white"
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
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <SlidersHorizontal size={12} className="text-white/60" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Active filters:</span>
              </div>
              {searchQuery && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-black text-white border border-white/10 uppercase tracking-widest">
                  Search: {searchQuery}
                </span>
              )}
              {selectedCategory !== "All" && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-black text-white border border-white/10 uppercase tracking-widest">
                  {selectedCategory}
                </span>
              )}
              {filterSort !== "featured" && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-black text-white border border-white/10 uppercase tracking-widest">
                  {SORT_OPTIONS.find((o) => o.value === filterSort)?.label}
                </span>
              )}
            </div>
          )}

          {/* Product grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#222b35] py-32 shadow-xl">
              <Spinner size={40} />
              <p className="mt-4 text-xs font-black text-white/50 uppercase tracking-widest">LOADING CATALOG...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#222b35] py-32 text-center shadow-xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-white/30 border border-white/10">
                <PackageSearch size={36} />
              </div>
              <h3 className="mt-5 text-lg font-black text-white uppercase tracking-wider">No items found</h3>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-white/45 uppercase tracking-widest">
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
            <p className="pt-4 text-center text-[9px] uppercase tracking-[0.25em] text-white/30 font-black">
              Showing all {products.length} products · WAVE 01 updates live
            </p>
          )}
        </section>

        {/* Bottom Artic Slogan & Mountain Section */}
        <section 
          className="relative overflow-hidden rounded-[32px] border border-white/10 shadow-2xl min-h-[400px] flex items-end bg-cover bg-center mt-20 p-8 md:p-12"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486873249359-2731bd6dafc7?w=1600&q=80')" }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b222a] via-[#1b222a]/70 to-transparent" />

          {/* Giant stenciled background logo */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden z-0">
            <span className="text-[12rem] sm:text-[18rem] md:text-[24rem] lg:text-[30rem] font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent select-none font-sans stroke-[1.5] stroke-white/15">
              WAVE
            </span>
          </div>

          <div className="relative w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-end z-10 text-white">
            {/* Left brand description */}
            <div className="md:col-span-4 text-[10px] font-black uppercase tracking-[0.25em] text-white/50 leading-relaxed max-w-xs select-none">
              <p className="text-white mb-2">✦ THE LOCO ORIGIN</p>
              LOCO WAS BORN IN
              <br />
              THE MOUNTAINS, NOT
              <br />
              AS A TREND, BUT AS
              <br />
              A RESPONSE.
            </div>

            {/* Middle large slogan */}
            <div className="md:col-span-5 flex flex-col justify-end">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.95] tracking-tight font-sans">
                BUILT FOR COLD
                <br />
                MADE FOR HEIGHT
                <br />
                FORGED TO LAST
              </h3>
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
