"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Search,
  User,
  LogOut,
  Package,
  Menu,
  X,
  ChevronDown,
  Home,
  Sparkles,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useStore } from "@/store/useStore";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const {
    cartCount,
    setCartCount,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
  } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /* Fetch cart count on session change */
  useEffect(() => {
    if (session) {
      fetch("/api/cart/count")
        .then((r) => r.json())
        .then((d) => setCartCount(d.count || 0))
        .catch(() => {});
    } else {
      setCartCount(0);
    }
  }, [session, setCartCount]);

  /* Shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      router.push("/");
    }
  };

  const handleLogoClick = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#products`);
    }
    setMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/10 bg-[#1b222a]/95 backdrop-blur-md transition-shadow duration-200 ${
        scrolled ? "shadow-lg shadow-black/20" : "shadow-none"
      }`}
    >
      <div ref={headerRef} className="mx-auto w-full max-w-screen-2xl px-6 sm:px-8 lg:px-10">
        <div className="flex h-24 items-center justify-between gap-6">

          {/* Logo */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex shrink-0 items-center gap-2 group select-none"
          >
            <span className="text-4xl font-black text-white tracking-tighter uppercase font-sans">
              LOCO
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.25em] text-white/60 select-none">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="hover:text-white transition-colors"
            >
              . HOME /
            </Link>
            <a
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname === "/") {
                  document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  router.push(`/#products`);
                }
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              . PRODUCTS /
            </a>
          </nav>

          {/* Search bar, heart, and bag */}
          <div className="flex items-center gap-4 flex-1 max-w-lg md:max-w-sm lg:max-w-md justify-end md:justify-start">
            <form onSubmit={handleSearch} className="hidden md:block w-full">
              <div className="relative">
                <Search size={18} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="SEARCH..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-12 pr-6 text-xs text-white placeholder:text-white/40 outline-none transition-all focus:border-white/20 focus:bg-white/10 uppercase tracking-widest font-black"
                />
              </div>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">


            {/* Cart button */}
            <Link
              href="/cart"
              className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-transparent text-white/70 hover:border-white hover:text-white transition-all"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5.5 min-w-[22px] items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-black text-[#1b222a] shadow-sm">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Login */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="inline-flex h-12 items-center gap-2.5 rounded-full border border-white/10 bg-transparent pl-2 pr-4 text-base font-semibold text-white hover:border-white transition-all cursor-pointer"
                >
                  <div className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white text-sm font-black text-[#1b222a]">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <ChevronDown
                    size={15}
                    className="text-white/50"
                  />
                </button>

                {profileOpen && (
                  <div className="animate-slide-down absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-white/15 bg-[#222b35] p-1.5 shadow-xl z-50">
                    <div className="bg-white/5 rounded-xl px-3 py-3 mb-1.5">
                      <p className="truncate text-xs font-black text-white">{session.user?.name}</p>
                      <p className="truncate text-[10px] text-white/50">{session.user?.email}</p>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        href="/orders"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-bold text-white/70 hover:bg-white/5 hover:text-white"
                      >
                        <Package size={14} className="text-white/50" /> My Orders
                      </Link>
                      <Link
                        href="/checkout"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-bold text-white/70 hover:bg-white/5 hover:text-white"
                      >
                        <Sparkles size={14} className="text-white/50" /> Checkout
                      </Link>
                      <div className="my-1 border-t border-white/10" />
                      <button
                        onClick={() => { signOut({ callbackUrl: "/" }); setProfileOpen(false); }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-base font-bold text-[#1b222a] transition-all hover:bg-slate-200"
              >
                <User size={16} /> Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-transparent text-white/70 hover:border-white md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="animate-slide-down md:hidden pb-4">
            <div className="rounded-2xl border border-white/10 bg-[#222b35] p-4 shadow-lg animate-fade-in">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="SEARCH..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-xs text-white outline-none uppercase tracking-wider"
                  />
                </div>
              </form>

              <div className="space-y-1 text-white/70 font-semibold">
                <Link
                  href="/"
                  onClick={() => { handleLogoClick(); setMenuOpen(false); }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/5 hover:text-white"
                >
                  <Home size={15} className="text-white/50" /> Home
                </Link>
                <a
                  href="#products"
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    if (window.location.pathname === "/") {
                      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      router.push(`/#products`);
                    }
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/5 hover:text-white cursor-pointer"
                >
                  <Package size={15} className="text-white/50" /> Products
                </a>

                {!session ? (
                  <Link
                    href="/auth"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white hover:bg-white/5"
                  >
                    <User size={15} /> Sign In
                  </Link>
                ) : (
                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-450 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

