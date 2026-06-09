import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ShopWave | Premium Shopping",
  description:
    "Discover thousands of premium products — electronics, fashion, home & more. Fast delivery, secure checkout, easy returns.",
  keywords: "online shopping, ecommerce, electronics, fashion, deals, india",
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
      <body className={`${jakarta.variable} font-sans antialiased`}>
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
