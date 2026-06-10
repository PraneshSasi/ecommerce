"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, ShoppingCart, Zap } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";
import { Product } from "@/types";

export default function HeroBanner() {
  const router = useRouter();
  const { data: session } = useSession();
  const { openAuthModal, setCartCount, setBuyNowItem } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product | null>(null);
  const [card1, setCard1] = useState<Product | null>(null);
  const [card2, setCard2] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function loadHeroProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data: Product[] = await res.json();
          setProducts(data);

          // Find specific featured items
          const jordan = data.find(p => p.title.toLowerCase().includes("jordan"));
          const sony = data.find(p => p.title.toLowerCase().includes("wh-1000xm5") || p.title.toLowerCase().includes("sony"));
          const iphone = data.find(p => p.title.toLowerCase().includes("iphone"));

          setFeatured(jordan || data[0] || null);
          setCard1(sony || data[1] || null);
          setCard2(iphone || data[2] || null);
        }
      } catch (err) {
        console.error("Error loading hero products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHeroProducts();
  }, []);

  const getProductImage = (product: Product | null, fallback: string) => {
    if (!product) return fallback;
    try {
      const parsed = JSON.parse(product.images);
      return parsed[0] || fallback;
    } catch {
      return fallback;
    }
  };

  const addToCart = async () => {
    if (!featured) return;
    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: featured.id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cartCount !== undefined) setCartCount(data.cartCount);
        toast.success("Added to cart!", {
          style: { background: "#ffffff", color: "#000000", border: "1px solid #e4e4e7" },
          iconTheme: { primary: "#ea580c", secondary: "#ffffff" },
        });
      } else if (res.status === 403) {
        toast.error("Session expired. Please sign in again.");
      }
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!featured) return;
    if (!session) {
      openAuthModal(addToCart);
      return;
    }
    await addToCart();
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!featured) return;

    const performCheckout = async () => {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: featured.id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cartCount !== undefined) setCartCount(data.cartCount);
        setBuyNowItem(featured.id);
        router.push("/checkout");
      }
    };

    if (!session) {
      openAuthModal(performCheckout);
      return;
    }
    await performCheckout();
  };

  // Static Fallback values in case products are not loaded yet
  const fallbackJordanImg = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80";
  const fallbackSonyImg = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
  const fallbackIphoneImg = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80";

  const mainProductTitle = featured ? featured.title : "Nike Air Jordan 1 Retro High OG";
  const mainProductBrand = featured ? featured.brand : "Nike";
  const mainProductPrice = featured ? `₹${featured.price.toLocaleString("en-IN")}` : "₹12,995";
  const mainProductDesc = featured 
    ? featured.description 
    : "The shoe that started it all returns in premium form. The Air Jordan 1 Retro High OG features a full-grain leather upper for durability and style.";

  return (
    <div className="w-full space-y-6">
      
      {/* 1. Giant text block at the top */}
      <div className="w-full text-center py-4 md:py-8 lg:py-10">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-none text-black select-none font-sans">
          FEEL THE VIBES
        </h1>
      </div>

      {/* 2. Horizontal ticker marquee tape */}
      <div className="w-full bg-black text-white py-3.5 overflow-hidden select-none border-y border-black rounded-lg">
        <div className="flex whitespace-nowrap">
          <div className="animate-ticker inline-flex items-center gap-12 font-black uppercase tracking-[0.25em] text-xs sm:text-sm">
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
          </div>
          <div className="animate-ticker inline-flex items-center gap-12 font-black uppercase tracking-[0.25em] text-xs sm:text-sm" aria-hidden="true">
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
            <span>CATCH THE STYLE 💥</span>
          </div>
        </div>
      </div>

      {/* 3. Main gradient banner with central model & floating cards */}
      <section className="relative overflow-hidden rounded-[32px] bg-loco-gradient shadow-xl min-h-[520px] md:min-h-[580px] lg:min-h-[640px] flex items-center">
        
        {/* Background glow or subtle highlights */}
        <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.1) 100%)" />
        
        <div className="relative mx-auto w-full max-w-screen-2xl px-6 py-12 md:px-12 md:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headline and static design spec card */}
          <div className="lg:col-span-6 z-10 flex flex-col justify-center text-white">
            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/20 border border-white/30 px-3.5 py-1 text-xs font-black uppercase tracking-wider mb-4">
              <Zap size={12} className="fill-current" />
              EXCLUSIVE COLLECTION
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight uppercase mb-4 max-w-lg">
              THE FUTURE
              <br />
              OF STREETWEAR
              <br />
              IS HERE
            </h2>
            <p className="max-w-md text-sm md:text-base text-white/85 leading-relaxed mb-6">
              Step into the next generation of style. Discover exclusive drops, premium quality fabrics, and curated design concepts built to elevate your everyday rotation.
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/95 select-none">
              <span className="rounded-full bg-white/20 border border-white/30 px-3 py-1.5 backdrop-blur-xs">
                ✦ SHIPS GLOBALLY
              </span>
              <span className="rounded-full bg-white/20 border border-white/30 px-3 py-1.5 backdrop-blur-xs">
                ✦ 100% ORIGINAL
              </span>
              <span className="rounded-full bg-white/20 border border-white/30 px-3 py-1.5 backdrop-blur-xs">
                ✦ EASY RETURNS
              </span>
            </div>

            {/* Aesthetic style details card & active palette */}
            <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-6 max-w-md shadow-lg space-y-6">
              {/* Palette pills */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 select-none">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/80">DESIGN PALETTE</span>
                <div className="flex items-center gap-2.5">
                  {[
                    { name: "Flame Red", hex: "bg-[#d31c26] ring-2 ring-white/50" },
                    { name: "Cyber Yellow", hex: "bg-[#facc15]" },
                    { name: "Onyx Black", hex: "bg-[#121212] border border-white/30" },
                    { name: "Pure White", hex: "bg-white" }
                  ].map((color) => (
                    <div 
                      key={color.name} 
                      className={`h-5 w-5 rounded-full transition-all duration-300 hover:scale-125 hover:rotate-12 cursor-pointer ${color.hex}`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Design specifications grid */}
              <div className="grid grid-cols-2 gap-4 select-none">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black tracking-[0.25em] text-white/60 uppercase">RELEASE</span>
                  <span className="text-sm font-black uppercase text-white tracking-wide mt-1">SPECIAL DROP</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black tracking-[0.25em] text-white/60 uppercase">DELIVERY</span>
                  <span className="text-sm font-black uppercase text-white tracking-wide mt-1">FREE & EXPRESS</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black tracking-[0.25em] text-white/60 uppercase">RETURNS</span>
                  <span className="text-sm font-black uppercase text-white tracking-wide mt-1">30-DAY WINDOW</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black tracking-[0.25em] text-white/60 uppercase">GUARANTEE</span>
                  <span className="text-sm font-black uppercase text-white tracking-wide mt-1">100% GENUINE</span>
                </div>
              </div>
              
              {/* Extra visual metadata badge */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/70">
                <span>JOIN THE LOCO CLUB FOR EXTRA PERKS</span>
                <span>EST. 2026</span>
              </div>
            </div>
          </div>

          {/* Right Column: Central model product image & floating cards */}
          <div className="lg:col-span-6 relative flex justify-center items-center h-[400px] md:h-[480px] lg:h-[540px] z-10 w-full mt-8 lg:mt-0">
            
            {/* Main Product Image Container */}
            <div className="relative w-[260px] h-[340px] md:w-[320px] md:h-[420px] lg:w-[380px] lg:h-[500px] overflow-hidden rounded-[36px] border-4 border-white bg-transparent shadow-2xl transition-transform duration-500 hover:scale-[1.02] flex items-center justify-center p-4 md:p-6 group select-none">
              <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-[#d31c26] flex items-center justify-center p-6 md:p-8">
                <div className="relative w-full h-full">
                  <Image
                    src={getProductImage(featured, fallbackJordanImg)}
                    alt={mainProductTitle}
                    fill
                    priority
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-w-md) 100vw, 380px"
                  />
                </div>
              </div>
            </div>

            {/* Floating Card 1: Top-Left (Sony Headphones) */}
            <div className="absolute top-4 left-2 md:left-6 lg:left-0 z-20 w-28 md:w-36 overflow-hidden rounded-[24px] border-4 border-white bg-white p-2.5 shadow-xl transform -rotate-6 transition-all duration-300 hover:rotate-0 hover:-translate-y-1 select-none">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-2 bg-[#facc15] flex items-center justify-center p-3">
                <div className="relative w-full h-full">
                  <Image
                    src={getProductImage(card1, fallbackSonyImg)}
                    alt={card1 ? card1.title : "Sony Headphones"}
                    fill
                    className="object-contain"
                    sizes="120px"
                  />
                </div>
              </div>
              <div className="bg-[#fcefe3] rounded-lg py-1.5 px-3 flex items-center justify-center">
                <span className="text-[9px] md:text-[10px] font-black text-[#5c3e21] uppercase tracking-widest leading-none">
                  {card1 ? card1.brand : "SONY"}
                </span>
              </div>
            </div>

            {/* Floating Card 2: Bottom-Right (Apple iPhone) */}
            <div className="absolute bottom-4 right-2 md:right-6 lg:right-0 z-20 w-28 md:w-36 overflow-hidden rounded-[24px] border-4 border-white bg-white p-2.5 shadow-xl transform rotate-6 transition-all duration-300 hover:rotate-0 hover:-translate-y-1 select-none">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-2 bg-[#121212] flex items-center justify-center p-3">
                <div className="relative w-full h-full">
                  <Image
                    src={getProductImage(card2, fallbackIphoneImg)}
                    alt={card2 ? card2.title : "Apple iPhone"}
                    fill
                    className="object-contain"
                    sizes="120px"
                  />
                </div>
              </div>
              <div className="bg-[#fcefe3] rounded-lg py-1.5 px-3 flex items-center justify-center">
                <span className="text-[9px] md:text-[10px] font-black text-[#5c3e21] uppercase tracking-widest leading-none">
                  {card2 ? card2.brand : "APPLE"}
                </span>
              </div>
            </div>

          </div>

        </div>

      </section>
    </div>
  );
}
