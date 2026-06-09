"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const columns = [
  {
    title: "Support",
    links: [
      { name: "Help Center & FAQ", href: "/info/help" },
      { name: "support@shopwave.com", href: "mailto:support@shopwave.com" },
      { name: "Helpline: +91 80 5555 9283", href: "/info/help" },
      { name: "30-Day Returns Policy", href: "/info/returns" },
      { name: "Track Order Status", href: "/info/help" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "ShopWave India Corp", href: "/info/about" },
      { name: "Bangalore Headquarters", href: "/info/about" },
      { name: "corp@shopwave.com", href: "mailto:corp@shopwave.com" },
      { name: "Our Story", href: "/info/story" },
      { name: "Careers", href: "/info/careers" },
      { name: "Privacy Policy", href: "/info/privacy" },
      { name: "Terms of Service", href: "/info/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 text-gray-700">
      <div className="mx-auto w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-xl font-black tracking-tighter text-black uppercase font-sans">LOCO</span>
            </Link>
            <p className="max-w-sm text-sm leading-6 text-gray-500">
              A high-fashion shopping experience with fast product discovery, clean details page layouts, and a streamlined checkout.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-gray-500">
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1">Secure checkout</span>
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1">Fast delivery</span>
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1">Easy returns</span>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-black">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-black">
                      {link.name}
                      <ArrowUpRight size={13} className="opacity-70" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 text-xs uppercase tracking-wider text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LOCO · ShopWave. All rights reserved.</p>
          <p>Evolving premium retail experience online.</p>
        </div>
      </div>
    </footer>
  );
}

