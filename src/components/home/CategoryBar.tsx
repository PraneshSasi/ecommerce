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
    <div className="flex items-center gap-6 overflow-x-auto pb-2.5 scrollbar-hide select-none border-b border-white/5">
      {categories.map(({ name }) => {
        const isActive = selectedCategory === name;
        return (
          <button
            key={name}
            onClick={() => setSelectedCategory(name)}
            className={`shrink-0 text-xs font-black uppercase tracking-[0.25em] transition-all duration-200 cursor-pointer ${
              isActive
                ? "text-white"
                : "text-white/40 hover:text-white/80"
            }`}
          >
            {isActive ? `[ ${name} ]` : name}
          </button>
        );
      })}
    </div>
  );
}
