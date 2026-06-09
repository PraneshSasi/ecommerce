"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Search,
  User,
  LogOut,
  Package,
  Zap,
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
  const { cartCount, setCartCount, searchQuery, setSearchQuery, setSelectedCategory } = useStore();
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
      className={`sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-xl transition-shadow duration-200 ${
        scrolled ? "shadow-md shadow-indigo-900/5" : "shadow-none"
      }`}
    >
      <div ref={headerRef} className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center gap-4">

          {/* Logo */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex shrink-0 items-center gap-3 group"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md shadow-indigo-500/30 transition-transform group-hover:scale-105">
              <Zap size={20} className="text-white" />
            </div>
            <div className="leading-tight hidden sm:block">
              <span className="block text-lg font-extrabold text-gray-900 tracking-tight">ShopWave</span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-indigo-500 font-semibold">Premium Retail</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-2">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-semibold text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Home size={16} /> Home
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-semibold text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-700"
            >
              <ShoppingCart size={16} /> Cart
            </Link>
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-semibold text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Sparkles size={16} /> Checkout
            </Link>
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-2xl lg:mx-4">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, brands, categories…"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 py-3.5 pl-12 pr-5 text-base text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/15 hover:border-gray-300"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">

            {/* Cart button */}
            <Link
              href="/cart"
              className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-gray-200 bg-white text-gray-600 transition-all hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md"
              aria-label="Cart"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 animate-fade-in items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 px-1.5 text-[11px] font-bold text-white shadow-sm">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Login */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="hidden sm:inline-flex h-12 items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white pl-1.5 pr-4 text-[15px] font-semibold text-gray-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-sm">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="max-w-28 truncate">{session.user?.name?.split(" ")[0]}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {profileOpen && (
                  <div className="animate-slide-down absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-900/10">
                    {/* User info */}
                    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border-b border-gray-100 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-sm">
                          {session.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-900">{session.user?.name}</p>
                          <p className="truncate text-xs text-gray-500">{session.user?.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/cart"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <Package size={16} className="text-indigo-500" /> My Orders
                      </Link>
                      <Link
                        href="/checkout"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <Sparkles size={16} className="text-violet-500" /> Checkout
                      </Link>
                      <div className="my-1 border-t border-gray-100" />
                      <button
                        onClick={() => { signOut({ callbackUrl: "/" }); setProfileOpen(false); }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-600 transition-colors hover:bg-rose-50"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="hidden sm:inline-flex h-12 items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-[15px] font-bold text-white shadow-md shadow-indigo-500/30 transition-all hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                <User size={17} /> Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-gray-200 bg-white text-gray-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 md:hidden"
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
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl shadow-gray-900/10">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products…"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </form>

              <div className="space-y-1">
                {[
                  { href: "/", label: "Home", icon: Home, onClick: () => { handleLogoClick(); setMenuOpen(false); } },
                  { href: "/cart", label: "Cart", icon: ShoppingCart, onClick: () => setMenuOpen(false) },
                  { href: "/checkout", label: "Checkout", icon: Sparkles, onClick: () => setMenuOpen(false) },
                ].map(({ href, label, icon: Icon, onClick }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={onClick}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <Icon size={16} className="text-indigo-500" /> {label}
                  </Link>
                ))}

                {!session ? (
                  <Link
                    href="/auth"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
                  >
                    <User size={16} /> Sign In
                  </Link>
                ) : (
                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOut size={16} /> Sign Out
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
