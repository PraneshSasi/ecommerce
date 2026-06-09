"use client";

import { useStore } from "@/store/useStore";
import { Layers, Cpu, Shirt, Home, Dumbbell, Gem } from "lucide-react";

const categories = [
  { name: "All", icon: Layers, color: "from-slate-600 to-slate-700" },
  { name: "Electronics", icon: Cpu, color: "from-blue-500 to-indigo-600" },
  { name: "Fashion", icon: Shirt, color: "from-pink-500 to-rose-600" },
  { name: "Home", icon: Home, color: "from-amber-500 to-orange-600" },
  { name: "Sports", icon: Dumbbell, color: "from-emerald-500 to-teal-600" },
  { name: "Premium", icon: Gem, color: "from-violet-500 to-purple-600" },
];

export default function CategoryBar() {
  const { selectedCategory, setSelectedCategory } = useStore();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map(({ name, icon: Icon }) => {
        const isActive = selectedCategory === name;
        return (
          <button
            key={name}
            onClick={() => setSelectedCategory(name)}
            className={`group flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer border ${
              isActive
                ? "border-black bg-black text-white shadow-xs"
                : "border-gray-200 bg-white text-gray-750 hover:border-black hover:text-black"
            }`}
          >
            <div className={`flex h-6 w-6 items-center justify-center rounded-lg shrink-0 transition-colors ${
              isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-black group-hover:text-white"
            }`}>
              <Icon size={12} />
            </div>
            {name}
          </button>
        );
      })}
    </div>
  );
}
