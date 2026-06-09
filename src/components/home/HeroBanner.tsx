"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Stars, Sparkles } from "lucide-react";

const stats = [
  { value: "2M+", label: "shoppers" },
  { value: "24h", label: "dispatch" },
  { value: "4.8/5", label: "average rating" },
];

const benefits = [
  { icon: Truck, title: "Free delivery", text: "On qualifying orders" },
  { icon: ShieldCheck, title: "Secure checkout", text: "Protected payment flow" },
  { icon: Sparkles, title: "Curated catalog", text: "Clear picks, not clutter" },
];

export default function HeroBanner() {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
      <div className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700">
            <Stars size={14} /> Spring refresh
          </div>

          <div className="space-y-4">
            <h1 className="max-w-none text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              A cleaner way to shop premium products online.
            </h1>
            <p className="max-w-none text-base leading-7 text-gray-600 sm:text-lg">
              Browse a focused catalog, compare products quickly, and move from discovery to checkout without friction.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="#products"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 shadow-sm"
            >
              Shop products <ArrowRight size={16} />
            </Link>
            <Link
              href="#products"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Explore categories
            </Link>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-gray-150 bg-gray-50 px-4 py-3">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 lg:pt-2">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="mt-1 text-sm leading-6 text-gray-500">{text}</p>
              </div>
            </div>
          ))}

          <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-4">
            <p className="text-sm font-semibold text-indigo-900">Featured store standard</p>
            <p className="mt-1 text-sm leading-6 text-indigo-950/70">
              Consistent imagery, compact controls, and readable spacing across every page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
