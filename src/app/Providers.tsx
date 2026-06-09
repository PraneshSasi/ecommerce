"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import AuthModal from "@/components/auth/AuthModal";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = useStore((state) => state.theme);

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

  return (
    <SessionProvider>
      {children}
      <AuthModal />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </SessionProvider>
  );
}
