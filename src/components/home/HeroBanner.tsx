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
          
          {/* Left Column: Headline and active buttons */}
          <div className="lg:col-span-6 z-10 flex flex-col justify-center text-white">
            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/20 border border-white/30 px-3.5 py-1 text-xs font-black uppercase tracking-wider mb-4">
              <Zap size={12} className="fill-current" />
              HOT DEAL
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight uppercase mb-4 max-w-lg">
              {mainProductTitle}
            </h2>
            <p className="max-w-md text-sm md:text-base text-white/85 leading-relaxed mb-6 line-clamp-3">
              {mainProductDesc}
            </p>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-black">{mainProductPrice}</span>
              {featured && featured.originalPrice > featured.price && (
                <span className="text-lg text-white/60 line-through">
                  ₹{featured.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {featured && featured.discount > 0 && (
                <span className="rounded-md bg-white text-orange-700 font-bold px-2 py-0.5 text-xs uppercase tracking-wide">
                  -{featured.discount}% OFF
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleBuyNow}
                disabled={featured?.stock === 0}
                className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-bold text-white uppercase tracking-wider transition-all duration-200 hover:bg-zinc-800 hover:-translate-y-0.5 shadow-md shadow-black/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
                <ArrowRight size={15} />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={adding || featured?.stock === 0}
                className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-transparent px-8 py-4 text-sm font-bold text-white uppercase tracking-wider transition-all duration-200 hover:bg-white hover:text-black hover:-translate-y-0.5 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Add to Cart
                    <ShoppingCart size={15} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Central model product image & floating cards */}
          <div className="lg:col-span-6 relative flex justify-center items-center h-[400px] md:h-[480px] lg:h-[540px] z-10 w-full mt-8 lg:mt-0">
            
            {/* Main Product Image Container */}
            <Link 
              href={featured ? `/product/${featured.id}` : "#products"}
              className="relative w-[260px] h-[340px] md:w-[320px] md:h-[420px] lg:w-[380px] lg:h-[500px] overflow-hidden rounded-[32px] border-4 border-white bg-white/10 backdrop-blur-md shadow-2xl transition-transform duration-500 hover:scale-[1.02] flex items-center justify-center p-8 group"
            >
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
            </Link>

            {/* Floating Card 1: Top-Left (Sony Headphones) */}
            <div className="absolute top-4 left-2 md:left-6 lg:left-0 z-20 w-28 md:w-36 overflow-hidden rounded-2xl border-2 border-white bg-white/20 backdrop-blur-md p-1.5 shadow-lg transform -rotate-6 transition-all duration-300 hover:rotate-0 hover:-translate-y-1">
              <Link href={card1 ? `/product/${card1.id}` : "#products"}>
                <div className="relative h-20 md:h-28 rounded-xl overflow-hidden mb-1 bg-white p-2">
                  <Image
                    src={getProductImage(card1, fallbackSonyImg)}
                    alt={card1 ? card1.title : "Sony Headphones"}
                    fill
                    className="object-contain"
                    sizes="120px"
                  />
                </div>
                <p className="text-[9px] md:text-[10px] font-bold text-black text-center py-1 bg-white/80 rounded-lg uppercase tracking-wider truncate px-1">
                  {card1 ? card1.brand : "Sony"}
                </p>
              </Link>
            </div>

            {/* Floating Card 2: Bottom-Right (Apple iPhone) */}
            <div className="absolute bottom-4 right-2 md:right-6 lg:right-0 z-20 w-28 md:w-36 overflow-hidden rounded-2xl border-2 border-white bg-white/20 backdrop-blur-md p-1.5 shadow-lg transform rotate-6 transition-all duration-300 hover:rotate-0 hover:-translate-y-1">
              <Link href={card2 ? `/product/${card2.id}` : "#products"}>
                <div className="relative h-20 md:h-28 rounded-xl overflow-hidden mb-1 bg-white p-2">
                  <Image
                    src={getProductImage(card2, fallbackIphoneImg)}
                    alt={card2 ? card2.title : "Apple iPhone"}
                    fill
                    className="object-contain"
                    sizes="120px"
                  />
                </div>
                <p className="text-[9px] md:text-[10px] font-bold text-black text-center py-1 bg-white/80 rounded-lg uppercase tracking-wider truncate px-1">
                  {card2 ? card2.brand : "Apple"}
                </p>
              </Link>
            </div>

          </div>

        </div>

      </section>
    </div>
  );
}
