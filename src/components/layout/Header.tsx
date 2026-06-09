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
  ChevronRight,
  Home,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useStore } from "@/store/useStore";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/auth", label: "Account", icon: User },
];

export default function Header() {
  const { data: session } = useSession();
  const { cartCount, setCartCount, searchQuery, setSearchQuery } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      const element = document.getElementById("products");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#products`);
    }
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl shadow-xs">
      <div ref={headerRef} className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3 lg:gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-xs">
              <Zap size={17} />
            </div>
            <div className="leading-tight">
              <span className="block text-base font-semibold text-gray-900">ShopWave</span>
              <span className="block text-[11px] uppercase tracking-[0.24em] text-gray-400">Premium retail</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center rounded-lg border border-gray-200 bg-gray-50/50 p-1">
            <Link href="/" className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
              <Home size={14} /> Home
            </Link>
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={label} href={href} className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
                <Icon size={14} /> {label}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-2xl lg:mx-4">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, brands, and deals"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (window.location.pathname === "/") {
                    const element = document.getElementById("products");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-hidden transition-colors focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((open) => !open)}
                  className="hidden sm:inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:border-indigo-600 hover:bg-gray-50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="max-w-28 truncate">{session.user?.name?.split(" ")[0]}</span>
                  <ChevronRight size={14} className={`transition-transform text-gray-400 ${profileOpen ? "rotate-90" : ""}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-gray-900">{session.user?.name}</p>
                      <p className="truncate text-xs text-gray-500">{session.user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/cart"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                      >
                        <Package size={16} className="text-gray-400" /> My Orders
                      </Link>
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/" });
                          setProfileOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
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
                className="hidden sm:inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                <User size={16} /> Login
              </Link>
            )}

            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-indigo-600 hover:bg-indigo-50 md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (window.location.pathname === "/") {
                        const element = document.getElementById("products");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    }}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </form>

              <div className="space-y-1">
                <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center justify-between rounded-md px-3 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                  Home
                  <ChevronRight size={14} className="text-gray-400" />
                </Link>
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link key={label} href={href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between rounded-md px-3 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                    <span className="flex items-center gap-2">
                      <Icon size={14} className="text-indigo-600" /> {label}
                    </span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </Link>
                ))}
                {!session && (
                  <Link href="/auth" onClick={() => setMenuOpen(false)} className="flex items-center justify-between rounded-md px-3 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                    <span className="flex items-center gap-2">
                      <User size={14} className="text-indigo-600" /> Login
                    </span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </Link>
                )}
                {session && (
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-md px-3 py-3 text-sm text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
                  >
                    <span className="flex items-center gap-2">
                      <LogOut size={14} /> Sign Out
                    </span>
                    <ChevronRight size={14} className="text-rose-400" />
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


