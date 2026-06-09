"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { Product } from "@/types";
import ImageGallery from "@/components/product/ImageGallery";
import ProductMeta from "@/components/product/ProductMeta";
import ActionButtons from "@/components/product/ActionButtons";
import Spinner from "@/components/ui/Spinner";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
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
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center shadow-xs">
          <Spinner size={40} />
          <p className="mt-4 text-sm text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md rounded-xl border border-gray-200 bg-white px-6 py-10 text-center shadow-xs">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            The product you are looking for does not exist or is no longer available.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 cursor-pointer shadow-sm"
          >
            Back to shop
          </button>
        </div>
      </div>
    );
  }

  const images: string[] = JSON.parse(product.images);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to products
      </button>

      <div className="mb-6 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">Product details</p>
        <h1 className="text-2xl font-bold text-gray-950 md:text-3xl">{product.title}</h1>
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
              <div key={title} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 lg:p-6 shadow-xs">
          <ProductMeta product={product} />
          <div className="border-t border-gray-200 pt-5">
            <ActionButtons productId={product.id} disabled={product.stock === 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

