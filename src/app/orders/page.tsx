"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Package, MapPin, CreditCard, ChevronRight } from "lucide-react";
import Spinner from "@/components/ui/Spinner";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    title: string;
    brand: string;
    images: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  payment: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth?callbackUrl=/orders");
      return;
    }
    if (status === "authenticated") {
      void fetchOrders();
    }
  }, [status, fetchOrders, router]);

  const getProductImage = (imagesStr: string) => {
    try {
      const parsed = JSON.parse(imagesStr);
      return parsed[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80";
    } catch {
      return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#050507] text-white px-4">
        <div className="rounded-2xl border border-red-950/20 bg-[#0a0a0c] px-8 py-12 text-center shadow-xl max-w-sm">
          <Spinner size={40} />
          <p className="mt-4 text-xs font-black uppercase tracking-[0.25em] text-red-500/70 font-mono">Retrieving order files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        
        {/* Back Link */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-white cursor-pointer select-none font-mono"
        >
          <ArrowLeft size={14} /> Return to collection
        </button>

        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500 font-mono">✦ USER REGISTRY DEPLOYMENT</p>
          <h1 className="text-4xl font-black uppercase tracking-tight text-white leading-none font-mono">MY ORDERS</h1>
          <p className="mt-1 text-xs font-bold text-gray-450 uppercase tracking-widest font-mono">
            {orders.length} {orders.length === 1 ? "order" : "orders"} persisted on network
          </p>
        </div>

        {/* Orders Listing */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-red-950/20 bg-[#0a0a0c] py-32 text-center shadow-xl">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-950/10 text-red-500 border border-red-950/20">
              <Package size={36} />
            </div>
            <h3 className="mt-6 text-lg font-black text-white uppercase tracking-widest font-mono">No orders recorded</h3>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-gray-400 uppercase tracking-widest font-mono">
              You haven't placed any streetwear orders yet. Head to the collection to start.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-red-700 cursor-pointer shadow-md font-mono"
            >
              Discover Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-8 perspective-3d">
            {orders.map((order) => (
              <div
                key={order.id}
                className="group relative overflow-hidden rounded-[24px] border border-red-950/20 bg-[#0a0a0c] shadow-2xl p-6 transition-all duration-500 hover:border-red-950/40 tilt-3d-center"
              >
                
                {/* Order Meta Header Bar */}
                <div className="flex flex-col gap-4 border-b border-white/5 pb-6 md:flex-row md:items-center md:justify-between">
                  <div className="grid grid-cols-2 md:flex md:items-center gap-6">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 leading-none font-mono">ORDER ID</p>
                      <p className="mt-1.5 text-xs font-mono font-bold text-white uppercase leading-none">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 leading-none font-mono">PLACED ON</p>
                      <p className="mt-1.5 text-xs font-black text-white uppercase leading-none font-mono">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 leading-none font-mono">TOTAL BILL</p>
                      <p className="mt-1.5 text-xs font-black text-white uppercase leading-none font-mono">
                        ₹{order.total.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 leading-none font-mono">PAYMENT</p>
                      <p className="mt-1.5 text-xs font-black text-white uppercase leading-none font-mono">
                        {order.payment === "cod" ? "C.O.D." : "CARD/ONLINE"}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="self-start md:self-auto">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-950/20 border border-red-950/30 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-red-500 font-mono">
                      <Clock size={10} className="text-red-500/60" /> [ {order.status.toUpperCase()} ]
                    </span>
                  </div>
                </div>

                {/* Items & Shipping Split */}
                <div className="grid gap-6 pt-6 lg:grid-cols-12 items-start">
                  
                  {/* Items list */}
                  <div className="lg:col-span-8 space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 rounded-xl border border-white/5 bg-[#0c0c0f] p-3 items-center group/item hover:bg-red-950/5 transition-colors">
                        <Link href={`/product/${item.productId}`} className="shrink-0">
                          <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-red-950/5 border border-red-950/20 flex items-center justify-center p-1">
                            <Image
                              src={getProductImage(item.product.images)}
                              alt={item.product.title}
                              fill
                              className="object-contain p-1"
                              sizes="64px"
                            />
                          </div>
                        </Link>
                        
                        <div className="min-w-0 flex-1">
                          <Link href={`/product/${item.productId}`}>
                            <h4 className="line-clamp-1 text-xs font-black uppercase tracking-tight text-white group-hover/item:text-red-500 transition-colors font-mono">
                              {item.product.title}
                            </h4>
                          </Link>
                          <p className="mt-0.5 text-[9px] font-black uppercase tracking-widest text-red-500 font-mono">{item.product.brand}</p>
                          <p className="mt-2 text-[10px] font-bold text-gray-400 font-mono">
                            QTY {item.quantity} · <span className="font-mono">₹{item.price.toLocaleString("en-IN")}</span> per unit
                          </p>
                        </div>
                        
                        <Link href={`/product/${item.productId}`} className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-transparent text-gray-400 hover:text-white hover:border-white transition-all">
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Shipping address details */}
                  <div className="lg:col-span-4 rounded-xl border border-white/5 bg-[#0c0c0f] p-4 space-y-4">
                    <div>
                      <h4 className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-red-500 mb-3 font-mono">
                        <MapPin size={12} className="text-red-500/60" /> SHIPPING DESTINATION
                      </h4>
                      <p className="text-xs font-black text-white uppercase font-mono">{order.fullName}</p>
                      <p className="mt-2 text-xs leading-5 text-gray-300 uppercase font-medium font-mono">
                        {order.addressLine}
                        <br />
                        {order.city}, {order.state} - {order.pincode}
                      </p>
                      <p className="mt-2 text-xs font-mono font-semibold text-gray-500">PHONE: {order.phone}</p>
                    </div>

                    <div className="border-t border-white/5 pt-4">
                      <h4 className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-red-500 mb-2 font-mono">
                        <CreditCard size={12} className="text-red-500/60" /> SECURITY LOG
                      </h4>
                      <p className="text-[10px] text-red-500/80 leading-relaxed font-bold uppercase tracking-wider font-mono">
                        ENCRYPTED PERSISTENCE SECURE TRANSACTION LOGGED
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
