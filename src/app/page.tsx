"use client";

import { useEffect, useState, useCallback } from "react";
import { useStore } from "@/store/useStore";
import { Product } from "@/types";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryBar from "@/components/home/CategoryBar";
import ProductCard from "@/components/home/ProductCard";
import Spinner from "@/components/ui/Spinner";
import { PackageSearch } from "lucide-react";

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
    <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <HeroBanner />

      <section id="products" className="mt-10 space-y-6">
        <div className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white px-5 py-5 lg:flex-row lg:items-end lg:justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">Browse the catalog</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategory !== "All"
                ? selectedCategory
                : "Featured products"}
            </h2>
            <p className="text-sm text-gray-500">
              Clean product cards, clear pricing, and quick actions across the catalog.
            </p>
          </div>

          {!loading && (
            <div className="rounded-lg border border-gray-250 bg-gray-50 px-4 py-2 text-sm text-gray-700">
              <span className="font-bold text-gray-900">{products.length}</span> product
              {products.length !== 1 ? "s" : ""} shown
            </div>
          )}
        </div>

        <CategoryBar />

        {/* Filter and Sort Subbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="text-sm font-medium text-gray-500">
            Customize results
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Sort & Filter</span>
            <select
              value={filterSort}
              onChange={(e) => setFilterSort(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus:border-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/25 transition-all cursor-pointer"
            >
              <option value="featured">Featured / Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Top Rated</option>
              <option value="filter_budget">Budget Range (under ₹1,000)</option>
              <option value="filter_mid">Mid-Range (₹1,000 - ₹10,000)</option>
              <option value="filter_premium">Premium Range (over ₹10,000)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-24 shadow-xs">
            <Spinner size={36} />
            <p className="mt-4 text-sm text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-24 text-center shadow-xs">
            <PackageSearch size={48} className="text-gray-400" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">No products found</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Try a different search term or switch categories to reveal more items.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
