import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ShopWave | Premium Shopping",
  description:
    "A polished storefront for premium products, fast checkout, and a streamlined shopping experience.",
  keywords: "online shopping, ecommerce, electronics, fashion, deals",
  openGraph: {
    title: "ShopWave | Premium Shopping",
    description: "Browse premium products with a clean, fast shopping experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="relative min-h-screen overflow-x-hidden">
            <Header />
            <main className="min-h-[calc(100vh-5rem)]">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
