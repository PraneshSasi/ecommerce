"use client";

import Link from "next/link";
import { ArrowUpRight, Zap } from "lucide-react";

const columns = [
  {
    title: "Shop",
    links: ["Electronics", "Fashion", "Home & Living", "Sports"],
  },
  {
    title: "Support",
    links: ["Help Center", "Track Order", "Returns", "Contact Us"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Privacy Policy"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-600">
                <Zap size={16} />
              </div>
              <span className="text-lg font-semibold text-gray-900">ShopWave</span>
            </Link>
            <p className="max-w-sm text-sm leading-6 text-gray-500">
              A focused shopping experience with fast discovery, clean product detail pages, and a checkout flow that stays out of the way.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">Secure checkout</span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">Fast delivery</span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">Easy returns</span>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-gray-900">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-indigo-600">
                      {link}
                      <ArrowUpRight size={14} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ShopWave. All rights reserved.</p>
          <p>Built for a cleaner, faster shopping flow.</p>
        </div>
      </div>
    </footer>
  );
}
