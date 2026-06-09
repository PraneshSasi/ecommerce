"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import AuthModal from "@/components/auth/AuthModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <AuthModal />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </SessionProvider>
  );
}
