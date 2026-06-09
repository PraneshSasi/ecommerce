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
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Hero */}
        <HeroBanner />

        {/* Promo strip */}
        <div className="mt-5 flex items-center gap-4 overflow-x-auto rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 py-3.5 scrollbar-hide">
          {[
            "🚀 Free shipping on orders above ₹499",
            "🎉 New arrivals every week",
            "🔒 100% secure payments",
            "↩️  Easy 30-day returns",
            "⚡ Lightning-fast delivery",
          ].map((text) => (
            <span key={text} className="shrink-0 text-sm font-medium text-white/90">
              {text}
            </span>
          ))}
        </div>

        {/* Products section */}
        <section id="products" className="mt-8 space-y-5">
          {/* Section header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-indigo-600" />
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">Catalog</p>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{sectionTitle}</h2>
              {!loading && (
                <p className="mt-1 text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">{products.length}</span>{" "}
                  {products.length === 1 ? "product" : "products"} found
                </p>
              )}
            </div>

            {/* Sort control */}
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-xs">
              <ArrowUpDown size={15} className="text-gray-400 shrink-0" />
              <label htmlFor="sort-filter" className="sr-only">Sort</label>
              <select
                id="sort-filter"
                value={filterSort}
                onChange={(e) => setFilterSort(e.target.value)}
                className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
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
              <div className="flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1">
                <SlidersHorizontal size={12} className="text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-700">Active filters:</span>
              </div>
              {searchQuery && (
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                  Search: {searchQuery}
                </span>
              )}
              {selectedCategory !== "All" && (
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-800">
                  {selectedCategory}
                </span>
              )}
              {filterSort !== "featured" && (
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800">
                  {SORT_OPTIONS.find((o) => o.value === filterSort)?.label}
                </span>
              )}
            </div>
          )}

          {/* Product grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-32 shadow-xs">
              <Spinner size={40} />
              <p className="mt-4 text-sm font-medium text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-32 text-center shadow-xs">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <PackageSearch size={36} className="text-gray-400" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-900">No products found</h3>
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
            <p className="pt-4 text-center text-sm text-gray-400">
              Showing all {products.length} products · More arriving soon
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
