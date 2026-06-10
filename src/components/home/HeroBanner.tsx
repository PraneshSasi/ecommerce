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
      
      {/* Main Artic-themed banner with mountain backdrop, stencil, and technical cards */}
      <section 
        className="relative overflow-hidden rounded-[32px] border border-white/10 shadow-2xl min-h-[520px] md:min-h-[580px] lg:min-h-[640px] flex items-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80')" }}
      >
        
        {/* Dark slate overlay to match theme */}
        <div className="absolute inset-0 bg-[#1b222a]/80 backdrop-blur-[2px]" />

        {/* Giant stenciled background logo */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden z-0">
          <span className="text-[12rem] sm:text-[18rem] md:text-[24rem] lg:text-[32rem] font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent select-none font-sans stroke-[1.5] stroke-white/15">
            LOCO
          </span>
        </div>
        
        <div className="relative mx-auto w-full max-w-screen-2xl px-6 py-12 md:px-12 md:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
          
          {/* Left Column: Headline and circular arrow CTA */}
          <div className="lg:col-span-6 z-10 flex flex-col justify-center text-white">
            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-4 select-none">
              ✦ SEASON 01 // WAVE 01
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight uppercase mb-6 max-w-lg font-sans">
              COLLECTION
              <br />
              WAVE 01™
            </h2>
            
            <div className="flex flex-col gap-1 mb-8 text-[11px] font-black uppercase tracking-[0.25em] text-white/50 select-none">
              <p>SIZE: <span className="text-white ml-2">S &nbsp; M &nbsp; L &nbsp; XL</span></p>
              <p>COLOUR: <span className="text-white ml-2">WHITE &nbsp; SILVER</span></p>
            </div>

            {/* Circular CTA Arrow Button */}
            <button 
              onClick={handleAddToCart}
              disabled={adding || featured?.stock === 0}
              className="flex items-center gap-6 select-none bg-transparent border-none outline-none text-left p-0 cursor-pointer disabled:opacity-50 group/arrow text-white"
            >
              {/* Circle Button */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-transparent text-white group-hover/arrow:bg-white group-hover/arrow:text-[#1b222a] transition-all duration-300">
                {adding ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white group-hover/arrow:border-zinc-800/30 group-hover/arrow:border-t-zinc-800" />
                ) : (
                  <ArrowRight size={24} className="-rotate-45 transition-transform duration-300 group-hover/arrow:translate-x-0.5 group-hover/arrow:-translate-y-0.5" />
                )}
              </div>
              
              {/* CTA details */}
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-[0.25em] text-white/50 uppercase leading-none">
                  {adding ? "ADDING..." : "ADD TO CART"}
                </span>
                <span className="text-2xl font-black text-white mt-1.5 leading-none">
                  {mainProductPrice}
                </span>
              </div>
            </button>
          </div>

          {/* Right Column: Central model product image & detail cards */}
          <div className="lg:col-span-6 flex flex-col md:flex-row items-center justify-center gap-6 z-10 w-full mt-8 lg:mt-0">
            
            {/* Main Product Image Container */}
            <div className="relative w-[280px] h-[360px] md:w-[320px] md:h-[420px] lg:w-[360px] lg:h-[480px] overflow-hidden rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl transition-transform duration-500 hover:scale-[1.02] flex items-center justify-center p-6 group select-none">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#889bb0]/30 flex items-center justify-center p-8">
                <div className="relative w-full h-full">
                  <Image
                    src={getProductImage(featured, fallbackJordanImg)}
                    alt={mainProductTitle}
                    fill
                    priority
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-w-md) 100vw, 360px"
                  />
                </div>
              </div>
            </div>

            {/* Side Detail Cards Column */}
            <div className="flex flex-row md:flex-col gap-4">
              {/* Detail Card 1 (Sony Headphones) */}
              <div className="w-[130px] h-[170px] md:w-[150px] md:h-[200px] overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-2 shadow-xl transition-all duration-300 hover:-translate-y-1 select-none">
                <div className="relative h-2/3 rounded-lg overflow-hidden mb-2 bg-[#889bb0]/20 flex items-center justify-center p-2">
                  <Image
                    src={getProductImage(card1, fallbackSonyImg)}
                    alt={card1 ? card1.title : "Sony Headphones"}
                    fill
                    className="object-contain"
                    sizes="120px"
                  />
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-white/50 uppercase tracking-widest leading-none">DETAIL 01</p>
                  <p className="text-[10px] font-black text-white uppercase tracking-wider mt-1 truncate px-1">
                    {card1 ? card1.brand : "SONY"}
                  </p>
                </div>
              </div>

              {/* Detail Card 2 (Apple iPhone) */}
              <div className="w-[130px] h-[170px] md:w-[150px] md:h-[200px] overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-2 shadow-xl transition-all duration-300 hover:-translate-y-1 select-none">
                <div className="relative h-2/3 rounded-lg overflow-hidden mb-2 bg-[#889bb0]/20 flex items-center justify-center p-2">
                  <Image
                    src={getProductImage(card2, fallbackIphoneImg)}
                    alt={card2 ? card2.title : "Apple iPhone"}
                    fill
                    className="object-contain"
                    sizes="120px"
                  />
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-white/50 uppercase tracking-widest leading-none">DETAIL 02</p>
                  <p className="text-[10px] font-black text-white uppercase tracking-wider mt-1 truncate px-1">
                    {card2 ? card2.brand : "APPLE"}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>
    </div>
  );
}
