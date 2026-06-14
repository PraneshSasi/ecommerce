"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Check, Send } from "lucide-react";

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
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  useEffect(() => {
    const subscribed = localStorage.getItem("shopwave-newsletter-subscribed");
    if (subscribed === "true") {
      setAlreadySubscribed(true);
    }
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;

    localStorage.setItem("shopwave-newsletter-subscribed", "true");
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-red-950/20 bg-black text-white/40">
      <div className="mx-auto w-full px-6 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-1 group select-none">
              <span className="text-red-600 font-extrabold text-2xl animate-pulse select-none font-serif leading-none mr-0.5">*</span>
              <span className="text-xl font-black tracking-tighter text-white uppercase font-sans">LOCO</span>
            </Link>
            <p className="max-w-sm text-sm leading-6 text-white/50">
              A high-fashion shopping experience with fast product discovery, clean details page layouts, and a streamlined checkout.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-white/50 font-mono">
              <span className="rounded-full border border-red-950/30 bg-white/5 px-3 py-1">Secure checkout</span>
              <span className="rounded-full border border-red-950/30 bg-white/5 px-3 py-1">Fast delivery</span>
              <span className="rounded-full border border-red-950/30 bg-white/5 px-3 py-1">Easy returns</span>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white font-mono">{col.title}</h3>
              <ul className="space-y-3 font-mono">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="inline-flex items-center gap-1 text-sm text-white/50 transition-colors hover:text-white">
                      {link.name}
                      <ArrowUpRight size={13} className="opacity-70 text-red-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-10 rounded-2xl border border-red-950/20 bg-white/[0.02] p-6">
          {alreadySubscribed || submitted ? (
            <div className="flex items-center justify-center gap-3 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/20 text-red-500">
                <Check size={18} className="animate-[scale-in_0.3s_ease-out]" />
              </span>
              <span className="text-sm font-bold uppercase tracking-[0.25em] text-white font-mono">
                ✓ You&apos;re Subscribed
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-red-500" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-white font-mono">
                    Stay in the Loop
                  </h3>
                </div>
                <p className="max-w-md text-sm text-white/50">
                  Get exclusive deals, new arrivals, and style inspiration delivered to your inbox.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex w-full max-w-sm">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full rounded-l-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-red-500/50"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-r-lg bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white font-mono transition-colors hover:bg-red-700"
                >
                  <Send size={14} />
                  Subscribe
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-red-950/20 pt-6 text-xs uppercase tracking-wider text-white/30 sm:flex-row sm:items-center sm:justify-between font-mono">
          <p>© 2026 LOCO · ShopWave. All rights reserved.</p>
          <p>Evolving premium retail experience online.</p>
        </div>
      </div>
    </footer>
  );
}
