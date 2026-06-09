"use client";

import { useStore } from "@/store/useStore";

const categories = ["All", "Electronics", "Fashion", "Home", "Sports"];

export default function CategoryBar() {
  const { selectedCategory, setSelectedCategory } = useStore();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-xs">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
