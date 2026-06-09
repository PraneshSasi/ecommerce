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

  const sectionTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : selectedCategory !== "All"
    ? selectedCategory
    : "All Products";

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Hero */}
        <HeroBanner />

        {/* Promo strip */}
        <div className="mt-5 flex items-center gap-4 overflow-x-auto rounded-full bg-black px-6 py-3.5 scrollbar-hide">
          {[
            "🚀 Free shipping on orders above ₹499",
            "🎉 New arrivals every week",
            "🔒 100% secure payments",
            "↩️  Easy 30-day returns",
            "⚡ Lightning-fast delivery",
          ].map((text) => (
            <span key={text} className="shrink-0 text-sm font-semibold text-white/90">
              {text}
            </span>
          ))}
        </div>

        {/* Products section */}
        <section id="products" className="relative z-10 mt-12 space-y-6">
          {/* Section header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-orange-600" />
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">Catalog</p>
              </div>
              <h2 className="text-3xl font-black text-black sm:text-4xl tracking-tight uppercase">{sectionTitle}</h2>
              {!loading && (
                <p className="mt-1 text-sm text-gray-500">
                  <span className="font-bold text-gray-900">{products.length}</span>{" "}
                  {products.length === 1 ? "product" : "products"} found
                </p>
              )}
            </div>

            {/* Sort control */}
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 shadow-xs">
              <ArrowUpDown size={15} className="text-gray-500 shrink-0" />
              <label htmlFor="sort-filter" className="sr-only">Sort</label>
              <select
                id="sort-filter"
                value={filterSort}
                onChange={(e) => setFilterSort(e.target.value)}
                className="bg-transparent text-sm font-semibold text-gray-800 focus:outline-none cursor-pointer [&>option]:bg-white [&>option]:text-black"
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
              <div className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1">
                <SlidersHorizontal size={12} className="text-orange-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Active filters:</span>
              </div>
              {searchQuery && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-800 border border-gray-200 uppercase tracking-wide">
                  Search: {searchQuery}
                </span>
              )}
              {selectedCategory !== "All" && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-800 border border-gray-200 uppercase tracking-wide">
                  {selectedCategory}
                </span>
              )}
              {filterSort !== "featured" && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-800 border border-gray-200 uppercase tracking-wide">
                  {SORT_OPTIONS.find((o) => o.value === filterSort)?.label}
                </span>
              )}
            </div>
          )}

          {/* Product grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 py-32 shadow-xs">
              <Spinner size={40} />
              <p className="mt-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 py-32 text-center shadow-xs">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <PackageSearch size={36} />
              </div>
              <h3 className="mt-5 text-xl font-bold text-black uppercase tracking-tight">No products found</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Try a different search term or switch categories to find what you&apos;re looking for.
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
            <p className="pt-4 text-center text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Showing all {products.length} products · More arriving soon
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
