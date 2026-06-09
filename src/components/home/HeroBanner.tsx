"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Sparkles, Star, Zap, Package, Headphones } from "lucide-react";
import { useStore } from "@/store/useStore";

const stats = [
  { value: "2M+", label: "Happy Shoppers" },
  { value: "24h", label: "Fast Dispatch" },
  { value: "4.8★", label: "Avg. Rating" },
  { value: "50k+", label: "Products" },
];

const benefits = [
  { icon: Truck, title: "Free Delivery", text: "On orders above ₹499", color: "from-blue-500 to-cyan-500" },
  { icon: ShieldCheck, title: "Secure Checkout", text: "256-bit SSL encryption", color: "from-violet-500 to-purple-600" },
  { icon: Sparkles, title: "Curated Picks", text: "Hand-picked for quality", color: "from-amber-500 to-orange-500" },
  { icon: Headphones, title: "24/7 Support", text: "Always here to help", color: "from-emerald-500 to-teal-500" },
];

export default function HeroBanner() {
  const { setSelectedCategory } = useStore();

  return (
    <section className="relative overflow-hidden rounded-2xl">
      {/* Gradient Background */}
      <div className="relative bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 px-6 py-14 sm:px-10 sm:py-16 lg:py-20">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-secondary-600/20 blur-[100px]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-cyan-600/10 blur-[80px]" />

        <div className="relative mx-auto max-w-6xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-500/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-400" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Summer Sale — Up to 60% off</span>
          </div>

          {/* Headline */}
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                Shop Smarter.{" "}
                <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-cyan-400 bg-clip-text text-transparent">
                  Live Better.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                Discover thousands of premium products — from cutting-edge electronics to timeless fashion — all in one place, with fast delivery and easy returns.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#products"
                  className="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-500/30 transition-all duration-200 hover:bg-primary-500 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                >
                  <Zap size={16} className="transition-transform group-hover:rotate-12" />
                  Shop Now
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#products"
                  onClick={() => setSelectedCategory("Electronics")}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5"
                >
                  <Package size={16} />
                  Browse Categories
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm text-center">
                    <div className="text-xl font-extrabold text-white">{s.value}</div>
                    <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges — right side */}
            <div className="hidden lg:flex lg:flex-col lg:gap-3 lg:min-w-[260px]">
              {benefits.map(({ icon: Icon, title, text, color }) => (
                <div
                  key={title}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-xs text-slate-400">{text}</p>
                  </div>
                </div>
              ))}

              {/* Rating card */}
              <div className="mt-1 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-5 py-4">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-sm font-bold text-amber-300">4.8</span>
                </div>
                <p className="text-xs text-amber-200/80">Trusted by over 2 million shoppers across India</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile benefits row */}
      <div className="grid grid-cols-2 gap-px bg-gray-200 lg:hidden">
        {benefits.map(({ icon: Icon, title, color }) => (
          <div key={title} className="flex items-center gap-3 bg-white px-4 py-3">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${color}`}>
              <Icon size={14} className="text-white" />
            </div>
            <p className="text-xs font-semibold text-gray-700">{title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
