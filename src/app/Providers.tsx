"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import AuthModal from "@/components/auth/AuthModal";
import CartSidebar from "@/components/layout/CartSidebar";
import QuickViewModal from "@/components/product/QuickViewModal";
import BackToTop from "@/components/ui/BackToTop";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = useStore((state) => state.theme);
  const isDarkMode = useStore((state) => state.isDarkMode);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const htmlEl = document.documentElement;
      // Remove any existing theme- classes
      const classesToRemove: string[] = [];
      htmlEl.classList.forEach((cls) => {
        if (cls.startsWith("theme-")) {
          classesToRemove.push(cls);
        }
      });
      classesToRemove.forEach((cls) => htmlEl.classList.remove(cls));
      // Add active theme class
      htmlEl.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const htmlEl = document.documentElement;
      if (isDarkMode) {
        htmlEl.setAttribute("data-theme", "dark");
        htmlEl.classList.add("dark");
      } else {
        htmlEl.setAttribute("data-theme", "light");
        htmlEl.classList.remove("dark");
      }
    }
  }, [isDarkMode]);

  return (
    <SessionProvider>
      {children}
      <AuthModal />
      <CartSidebar />
      <QuickViewModal />
      <BackToTop />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </SessionProvider>
  );
}
