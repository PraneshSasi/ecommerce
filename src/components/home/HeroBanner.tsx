"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, ShoppingCart, Zap } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
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

  const containerRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates [-0.5, 0.5]
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    
    setParallax({ x, y });
  };

  const handleMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

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
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden rounded-[32px] border border-red-950/20 shadow-2xl min-h-[520px] md:min-h-[580px] lg:min-h-[640px] flex items-center bg-cover bg-center hud-corner hud-corner-bottom group"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80')" }}
      >
        
        {/* Dark slate overlay to match theme */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-950/30 via-black/90 to-black/70 backdrop-blur-[2px]" />

        {/* Giant stenciled background logo */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden z-0">
          <span className="text-[12rem] sm:text-[18rem] md:text-[24rem] lg:text-[32rem] font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white/5 to-transparent select-none font-sans stroke-[1.5] stroke-red-900/10">
            LOCO
          </span>
        </div>

        {/* Advanced SVG HUD backdrop lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <svg className="absolute inset-0 w-full h-full text-red-500/10" xmlns="http://www.w3.org/2000/svg">
            {/* Center target HUD */}
            <circle cx="50%" cy="50%" r="280" className="stroke-current stroke-1 animate-rotate-slow fill-none" strokeDasharray="10, 20, 40, 10" />
            <circle cx="50%" cy="50%" r="200" className="stroke-current stroke-[0.5] animate-rotate-reverse-slow fill-none" strokeDasharray="5, 5" />
            <circle cx="50%" cy="50%" r="120" className="stroke-current stroke-[1] fill-none" strokeDasharray="30, 270" />
            {/* Crosshairs */}
            <line x1="50%" y1="10%" x2="50%" y2="90%" className="stroke-current stroke-[0.5]" strokeDasharray="5, 10" />
            <line x1="10%" y1="50%" x2="90%" y2="50%" className="stroke-current stroke-[0.5]" strokeDasharray="5, 10" />
            {/* Corner Bracket Accents */}
            <path d="M 60 60 L 80 60 L 80 80" className="stroke-current stroke-1 fill-none" />
            <path d="M 1900 60 L 1880 60 L 1880 80" className="stroke-current stroke-1 fill-none" />
          </svg>
          
          {/* Blinking HUD nodes */}
          <div className="absolute top-[8%] left-[6%] text-[7px] font-mono text-red-500/40 select-none animate-glow-pulse">LOC_GRID_NET // SHIFT_DETECTED</div>
          <div className="absolute bottom-[8%] right-[6%] text-[7px] font-mono text-red-500/40 select-none animate-glow-pulse">TELEMETRY_LINK_01 // STABLE // 1.2GBPS</div>
        </div>
        
        <div className="relative mx-auto w-full max-w-screen-2xl px-6 py-12 md:px-12 md:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
          
          {/* Left Column: Headline and circular arrow CTA */}
          <div className="lg:col-span-6 z-10 flex flex-col justify-center text-white p-6 rounded-2xl bg-black/10 border border-white/5 hud-corner backdrop-blur-xs relative overflow-hidden select-none">
            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-red-950/15 border border-red-950/30 px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-red-500 font-mono">
              ✦ CORE_STORE // CATALOG_ONLINE // SECURE
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight uppercase mb-6 max-w-lg font-sans">
              PREMIUM GEAR
              <br />
              WAVE_01 // ARCHIVE™
            </h2>
            
            {/* CTA details */}
            <div className="flex flex-col select-none text-white font-mono mt-2">
              <span className="text-[10px] font-black tracking-[0.25em] text-red-500 uppercase leading-none">RETRIEVING_INVENTORY // GLOBAL_DISPATCH</span>
              <span className="text-xl font-black text-white mt-2 leading-none uppercase tracking-widest border-b border-red-950/30 pb-1 flex justify-between items-center">
                SECURE CHECKOUT ✦ <span className="text-xs text-red-500 font-normal">SSL_ENCRYPTED</span>
              </span>
            </div>

            {/* Unique Tech stats grid added by assistant */}
            <div className="mt-6 grid grid-cols-3 gap-2 border border-white/5 bg-[#0a0a0c]/60 p-2.5 rounded-lg text-[8px] font-mono text-gray-500 uppercase tracking-wider">
              <div>
                <span className="block text-white font-bold">STOCK STATUS</span>
                <span className="block mt-0.5 truncate text-[7px] text-green-500">AVAILABLE // ACTIVE</span>
              </div>
              <div>
                <span className="block text-white font-bold">SHIPPING</span>
                <span className="block mt-0.5 text-[7px]">SAME-DAY DISPATCH</span>
              </div>
              <div>
                <span className="block text-white font-bold">PAYMENT</span>
                <span className="block mt-0.5 text-[7px]">100% SECURE SSL</span>
              </div>
            </div>
          </div>

          {/* Right Column: Central model product image & detail cards */}
          <div className="lg:col-span-6 flex flex-col md:flex-row items-center justify-center gap-6 z-10 w-full mt-8 lg:mt-0 perspective-3d">
            
            {/* Main Product Image Container */}
            <div 
              onClick={() => featured && router.push(`/product/${featured.id}`)}
              className="relative w-[280px] h-[380px] md:w-[320px] md:h-[440px] lg:w-[360px] lg:h-[480px] overflow-hidden rounded-[24px] border border-red-950/30 bg-black/40 backdrop-blur-md shadow-2xl flex flex-col justify-between p-6 group select-none hover:border-red-900/40 hud-corner hud-corner-bottom transition-all duration-300 cursor-pointer"
              style={{
                transform: `rotateY(${parallax.x * 20}deg) rotateX(${-parallax.y * 20}deg) translateZ(15px)`,
                transition: "transform 0.1s ease-out"
              }}
            >
              <div className="relative w-full h-[65%] rounded-2xl overflow-hidden bg-red-950/20 flex items-center justify-center p-8 [transform-style:preserve-3d]">
                {/* HUD scanline effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/5 to-transparent h-1/2 w-full animate-scanline opacity-0 group-hover:opacity-100 pointer-events-none" />
                <div className="relative w-full h-full animate-3d-nike [transform-style:preserve-3d]">
                  <div className="relative w-full h-full pop-3d-image">
                    <Image
                      src={getProductImage(featured, fallbackJordanImg)}
                      alt={mainProductTitle}
                      fill
                      priority
                      className="object-contain transition-transform duration-700 drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]"
                      sizes="(max-w-md) 100vw, 360px"
                    />
                  </div>
                </div>
              </div>

              {/* HUD specs details panel at the bottom of the featured card */}
              <div className="mt-4 border-t border-white/5 pt-3 font-mono flex flex-col gap-1 text-[9px] text-gray-400">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white font-black uppercase truncate max-w-[170px] text-xs">{mainProductTitle}</span>
                  <span className="text-red-500 font-black text-xs">{mainProductPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>PRODUCT INTEGRITY</span>
                  <span className="text-white select-all">{featured ? featured.id.slice(0, 8) : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>HUD LINK STATUS</span>
                  <span className="text-green-500 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    SECURE_LINK
                  </span>
                </div>
                {/* Tiny simulated progress loading bar */}
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-red-650 h-full w-[85%] animate-pulse" />
                </div>
              </div>
            </div>

            {/* Side Detail Cards Column */}
            <div className="flex flex-row md:flex-col gap-4">
              {/* Detail Card 1 (Sony Headphones) */}
              <div 
                onClick={() => card1 && router.push(`/product/${card1.id}`)}
                className="w-[130px] h-[190px] md:w-[150px] md:h-[225px] overflow-hidden rounded-xl border border-red-950/30 bg-black/40 backdrop-blur-md p-2 shadow-xl select-none hover:border-red-900/40 group cursor-pointer hud-corner hud-corner-bottom transition-all duration-300"
                style={{
                  transform: `rotateY(${parallax.x * 32}deg) rotateX(${-parallax.y * 32}deg) translateZ(30px)`,
                  transition: "transform 0.12s ease-out"
                }}
              >
                <div className="relative h-[55%] rounded-lg overflow-hidden mb-2 bg-red-950/20 flex items-center justify-center p-2 [transform-style:preserve-3d]">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/5 to-transparent h-1/2 w-full animate-scanline opacity-0 group-hover:opacity-100 pointer-events-none" />
                  <div className="relative w-full h-full animate-3d-sony [transform-style:preserve-3d]">
                    <div className="relative w-full h-full pop-3d-image">
                      <Image
                        src={getProductImage(card1, fallbackSonyImg)}
                        alt={card1 ? card1.title : "Sony Headphones"}
                        fill
                        className="object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)]"
                        sizes="120px"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center font-mono">
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none">SYS_DVC_01 // HF_AUDIO</p>
                  <p className="text-[10px] font-black text-white uppercase tracking-wider mt-1 truncate px-1">
                    {card1 ? card1.brand : "SONY"}
                  </p>
                  <p className="text-[9px] font-black text-red-500 mt-1">
                    {card1 ? `₹${card1.price.toLocaleString("en-IN")}` : "₹24,990"}
                  </p>
                </div>
              </div>
 
              {/* Detail Card 2 (Apple iPhone) */}
              <div 
                onClick={() => card2 && router.push(`/product/${card2.id}`)}
                className="w-[130px] h-[190px] md:w-[150px] md:h-[225px] overflow-hidden rounded-xl border border-red-950/30 bg-black/40 backdrop-blur-md p-2 shadow-xl select-none hover:border-red-900/40 group cursor-pointer hud-corner hud-corner-bottom transition-all duration-300"
                style={{
                  transform: `rotateY(${parallax.x * 32}deg) rotateX(${-parallax.y * 32}deg) translateZ(30px)`,
                  transition: "transform 0.12s ease-out"
                }}
              >
                <div className="relative h-[55%] rounded-lg overflow-hidden mb-2 bg-red-950/20 flex items-center justify-center p-2 [transform-style:preserve-3d]">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/5 to-transparent h-1/2 w-full animate-scanline opacity-0 group-hover:opacity-100 pointer-events-none" />
                  <div className="relative w-full h-full animate-3d-apple [transform-style:preserve-3d]">
                    <div className="relative w-full h-full pop-3d-image">
                      <Image
                        src={getProductImage(card2, fallbackIphoneImg)}
                        alt={card2 ? card2.title : "Apple iPhone"}
                        fill
                        className="object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)]"
                        sizes="120px"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center font-mono">
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none">SYS_DVC_02 // MOBILE_LINK</p>
                  <p className="text-[10px] font-black text-white uppercase tracking-wider mt-1 truncate px-1">
                    {card2 ? card2.brand : "APPLE"}
                  </p>
                  <p className="text-[9px] font-black text-red-500 mt-1">
                    {card2 ? `₹${card2.price.toLocaleString("en-IN")}` : "₹1,29,900"}
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
