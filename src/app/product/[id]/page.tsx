"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { Product } from "@/types";
import ImageGallery from "@/components/product/ImageGallery";
import ProductMeta from "@/components/product/ProductMeta";
import ActionButtons from "@/components/product/ActionButtons";
import ProductCard from "@/components/home/ProductCard";
import Spinner from "@/components/ui/Spinner";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    // Fetch product details
    fetch(`/api/products/${id}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setProduct(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    // Fetch related products
    fetch(`/api/products/${id}/related`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setRelatedProducts(data);
      })
      .catch((err) => console.error("Error fetching related products:", err));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 bg-[#050507]">
        <div className="rounded-xl border border-red-950/20 bg-[#0a0a0c] px-6 py-10 text-center shadow-xs">
          <Spinner size={40} />
          <p className="mt-4 text-sm text-gray-400 uppercase tracking-wider font-mono">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 bg-[#050507]">
        <div className="max-w-md rounded-xl border border-red-950/20 bg-[#0a0a0c] px-6 py-10 text-center shadow-xs">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-mono">Product not found</h2>
          <p className="mt-3 text-sm leading-6 text-gray-400 font-mono">
            The product you are looking for does not exist or is no longer available.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 cursor-pointer shadow-sm uppercase tracking-wider font-mono"
          >
            Back to shop
          </button>
        </div>
      </div>
    );
  }

  const images: string[] = JSON.parse(product.images);

  return (
    <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10 bg-[#050507] text-white">
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white cursor-pointer font-mono"
      >
        <ArrowLeft size={16} /> BACK TO PRODUCTS
      </button>
 
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-red-600 font-mono">PRODUCT DETAILS</p>
        <h1 className="text-2xl font-black text-white md:text-3xl uppercase tracking-tight font-mono">{product.title}</h1>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <ImageGallery images={images} title={product.title} />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, title: "Free delivery", sub: "On orders above ₹499" },
              { icon: RotateCcw, title: "Easy returns", sub: "30-day return policy" },
              { icon: ShieldCheck, title: "Secure pay", sub: "Protected checkout" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-3 rounded-xl border border-red-950/20 bg-[#0a0a0c] p-4 shadow-xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-950/10 text-red-600 border border-red-950/30">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white font-mono uppercase tracking-wider">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-gray-400 font-mono">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5 rounded-xl border border-red-950/20 bg-[#0a0a0c] p-5 lg:p-6 shadow-xs">
          <ProductMeta product={product} />
          <div className="border-t border-white/5 pt-5">
            <ActionButtons productId={product.id} disabled={product.stock === 0} />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-red-950/20 pt-10">
          <div className="flex flex-col gap-2 mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 font-mono">
              ✦ DISCOVER // WAVE 02
            </span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight font-mono">
              Related Products
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
