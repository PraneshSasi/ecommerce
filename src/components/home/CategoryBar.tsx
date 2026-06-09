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
      {categories.map(({ name, icon: Icon, color }) => {
        const isActive = selectedCategory === name;
        return (
          <button
            key={name}
            onClick={() => setSelectedCategory(name)}
            className={`group flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer border ${
              isActive
                ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/25 -translate-y-0.5"
                : "border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:-translate-y-0.5"
            }`}
          >
            <div className={`flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br ${color} shrink-0`}>
              <Icon size={12} className="text-white" />
            </div>
            {name}
          </button>
        );
      })}
    </div>
  );
}
