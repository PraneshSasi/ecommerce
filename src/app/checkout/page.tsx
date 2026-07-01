"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Banknote,
  CheckCircle2,
  Package,
  MapPin,
  ChevronRight,
  Zap,
  User,
} from "lucide-react";
import { CartItem } from "@/types";
import Spinner from "@/components/ui/Spinner";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";

const paymentMethods = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, sub: "Visa, Mastercard, RuPay" },
  { id: "upi", label: "UPI", icon: Smartphone, sub: "Google Pay, PhonePe, Paytm" },
  { id: "netbanking", label: "Net Banking", icon: Building2, sub: "All major banks" },
  { id: "wallet", label: "Wallets", icon: Wallet, sub: "Amazon Pay, Mobikwik" },
  { id: "cod", label: "Cash on Delivery", icon: Banknote, sub: "Pay when you receive" },
];

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const { setCartCount } = useStore();

  const [estimatedDelivery, setEstimatedDelivery] = useState({ minDate: "", maxDate: "" });

  useEffect(() => {
    const now = Date.now();
    const minDate = new Date(now + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    const maxDate = new Date(now + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    setEstimatedDelivery({ minDate, maxDate });
  }, []);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [profileFilled, setProfileFilled] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCartItems(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAndPrefillProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setAddress({
          fullName: data.name || "",
          phone: data.phone || "",
          addressLine: data.addressLine || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
        });
        // Mark as profile-filled if at least name or phone exists
        if (data.name || data.phone || data.addressLine) {
          setProfileFilled(true);
        }
      }
    } catch (error) {
      console.error("Failed to prefill profile:", error);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth?callbackUrl=/checkout");
      return;
    }
    if (status === "authenticated") {
      void fetchAndPrefillProfile();
      void fetchCart();
    }
  }, [status, fetchAndPrefillProfile, fetchCart, router]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const savings = cartItems.reduce(
    (sum, item) => sum + (item.product.originalPrice - item.product.price) * item.quantity,
    0
  );
  const delivery = subtotal >= 499 ? 0 : 49;
  const total = subtotal + delivery;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    // Validate address
    if (!address.fullName || !address.phone || !address.addressLine || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill in all delivery details.", {
        style: { background: "#ffffff", color: "#ea580c", border: "1px solid #ffedd5" },
      });
      return;
    }
    if (address.phone.length < 10) {
      toast.error("Please enter a valid phone number.", {
        style: { background: "#ffffff", color: "#ea580c", border: "1px solid #ffedd5" },
      });
      return;
    }

    setPlacingOrder(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total,
          fullName: address.fullName,
          phone: address.phone,
          addressLine: address.addressLine,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          payment: selectedPayment,
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      setOrderPlaced(true);
      toast.success("Order placed successfully! 🎉", {
        style: { background: "#ffffff", color: "#000000", border: "1px solid #e4e4e7" },
        iconTheme: { primary: "#ea580c", secondary: "#ffffff" },
        duration: 5000,
      });

      // Clear all cart items on server
      for (const item of cartItems) {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItemId: item.id }),
        }).catch(() => {});
      }

      // Reset header cart badge to 0
      setCartCount(0);
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order. Please try again.", {
        style: { background: "#ffffff", color: "#ea580c", border: "1px solid #ffedd5" },
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 bg-[#050507]">
        <div className="rounded-xl border border-red-950/20 bg-[#0a0a0c] px-6 py-10 text-center shadow-xs">
          <Spinner size={40} />
          <p className="mt-4 text-sm text-gray-400 uppercase tracking-wider font-mono">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 bg-[#050507]">
        <div className="max-w-lg rounded-2xl border border-red-950/20 bg-[#0a0a0c] p-8 text-center shadow-lg text-white">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-950/20 border border-red-950/30">
            <CheckCircle2 size={40} className="text-red-500" />
          </div>
          <h2 className="mt-6 text-2xl font-black uppercase tracking-tight text-white font-mono">Order Placed!</h2>
          <p className="mt-3 text-sm leading-6 text-gray-400 font-mono">
            Your order has been confirmed and will be shipped soon. Thank you for shopping with LOCO!
          </p>
          <div className="mt-6 rounded-xl border border-red-950/30 bg-red-950/10 px-4 py-3">
            <p className="text-sm font-bold text-red-500 uppercase tracking-wider font-mono">
              Order Total: ₹{total.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-red-400 font-mono">
              {totalItems} {totalItems === 1 ? "item" : "items"} • {selectedPayment === "cod" ? "Cash on Delivery" : "Paid Online"}
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 cursor-pointer shadow-sm font-mono"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 bg-[#050507]">
        <div className="max-w-md rounded-xl border border-red-950/20 bg-[#0a0a0c] px-6 py-12 text-center shadow-xs">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-red-950/20 bg-black text-red-500">
            <Package size={36} />
          </div>
          <h2 className="mt-5 text-2xl font-black text-white uppercase tracking-tight font-mono">Nothing to checkout</h2>
          <p className="mt-3 text-sm leading-6 text-gray-400 font-mono">Add some products to your cart first, then come back to checkout.</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 cursor-pointer shadow-sm font-mono"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10 bg-[#050507] text-white">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white cursor-pointer font-mono"
        >
          <ArrowLeft size={16} /> BACK
        </button>
        <div className="h-5 w-px bg-white/10" />
        <div className="inline-flex items-center gap-2 text-white">
          <ShieldCheck size={18} className="text-red-500" />
          <h1 className="text-xl font-black uppercase tracking-wider font-mono">SECURE CHECKOUT</h1>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <div className="rounded-xl border border-red-950/20 bg-[#0a0a0c] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white uppercase tracking-wider font-mono">
                <MapPin size={18} className="text-red-500" /> DELIVERY ADDRESS
              </h2>
              {profileFilled ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-400 font-mono">
                  <CheckCircle2 size={10} className="text-emerald-400" /> Auto-filled from profile
                </span>
              ) : (
                <Link href="/profile" className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-yellow-400 font-mono hover:bg-yellow-500/20 transition-colors">
                  <User size={10} /> Complete profile to auto-fill
                </Link>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Full Name</label>
                <input
                  name="fullName"
                  value={address.fullName}
                  onChange={handleAddressChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-white/10 bg-[#0c0c0f] px-4 py-2.5 text-sm text-white placeholder:text-gray-650 outline-hidden focus:border-red-600 focus:bg-black transition-colors font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Phone Number</label>
                <input
                  name="phone"
                  value={address.phone}
                  onChange={handleAddressChange}
                  placeholder="+91 9876543210"
                  className="w-full rounded-lg border border-white/10 bg-[#0c0c0f] px-4 py-2.5 text-sm text-white placeholder:text-gray-655 outline-hidden focus:border-red-600 focus:bg-black transition-colors font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Address</label>
                <input
                  name="addressLine"
                  value={address.addressLine}
                  onChange={handleAddressChange}
                  placeholder="House No, Street, Area"
                  className="w-full rounded-lg border border-white/10 bg-[#0c0c0f] px-4 py-2.5 text-sm text-white placeholder:text-gray-655 outline-hidden focus:border-red-600 focus:bg-black transition-colors font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">City</label>
                <input
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="Bangalore"
                  className="w-full rounded-lg border border-white/10 bg-[#0c0c0f] px-4 py-2.5 text-sm text-white placeholder:text-gray-655 outline-hidden focus:border-red-600 focus:bg-black transition-colors font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">State</label>
                  <input
                     name="state"
                     value={address.state}
                     onChange={handleAddressChange}
                     placeholder="Karnataka"
                     className="w-full rounded-lg border border-white/10 bg-[#0c0c0f] px-4 py-2.5 text-sm text-white placeholder:text-gray-655 outline-hidden focus:border-red-600 focus:bg-black transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Pincode</label>
                  <input
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    placeholder="560001"
                    className="w-full rounded-lg border border-white/10 bg-[#0c0c0f] px-4 py-2.5 text-sm text-white placeholder:text-gray-655 outline-hidden focus:border-red-600 focus:bg-black transition-colors font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border border-red-950/20 bg-[#0a0a0c] p-6 shadow-xs">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-5 uppercase tracking-wider font-mono">
              <CreditCard size={18} className="text-red-500" /> PAYMENT METHOD
            </h2>
            <div className="space-y-3">
              {paymentMethods.map(({ id, label, icon: Icon, sub }) => (
                <button
                  key={id}
                  onClick={() => setSelectedPayment(id)}
                  className={`flex w-full items-center gap-4 rounded-xl border px-4 py-4 text-left transition-all cursor-pointer ${
                    selectedPayment === id
                      ? "border-red-600 bg-red-950/15 shadow-xs"
                      : "border-white/5 bg-[#0c0c0f] hover:border-white/20"
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    selectedPayment === id ? "bg-red-600 text-white" : "bg-[#0a0a0c] text-gray-400 border border-white/5"
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold font-mono ${selectedPayment === id ? "text-red-500" : "text-white"}`}>{label}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{sub}</p>
                  </div>
                  {selectedPayment === id && (
                    <CheckCircle2 size={20} className="text-red-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-xl border border-red-950/20 bg-[#0a0a0c] p-6 shadow-xs">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-5 uppercase tracking-wider font-mono">
              <Package size={18} className="text-red-500" /> ORDER ITEMS ({totalItems})
            </h2>
            <div className="space-y-4">
              {cartItems.map((item) => {
                const images: string[] = JSON.parse(item.product.images);
                return (
                  <div key={item.id} className="flex gap-4 rounded-lg border border-white/5 bg-[#0a0a0c] p-3">
                    <Link href={`/product/${item.productId}`} className="shrink-0">
                      <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-red-950/20 bg-red-950/5">
                        <Image src={images[0]} alt={item.product.title} fill className="object-contain p-1" sizes="80px" />
                      </div>
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-white font-mono uppercase">{item.product.title}</p>
                      <p className="mt-1 text-xs font-black uppercase tracking-wider text-red-500 font-mono">{item.product.brand}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-sm font-bold text-white font-mono">₹{item.product.price.toLocaleString("en-IN")}</span>
                        <span className="text-xs text-gray-500 line-through font-mono">₹{item.product.originalPrice.toLocaleString("en-IN")}</span>
                        <span className="text-xs text-gray-400 font-mono">× {item.quantity}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-white font-mono">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column — Order Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-red-950/20 bg-[#0a0a0c] p-6 shadow-xs">
            <h2 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white font-mono">
              <Zap size={18} className="text-red-500" /> ORDER SUMMARY
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-mono">Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-white font-mono">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-mono">Discount</span>
                  <span className="font-semibold text-red-500 font-mono">-₹{savings.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-mono">Delivery</span>
                <span className={delivery === 0 ? "font-semibold text-red-500 font-mono" : "font-semibold text-white font-mono"}>
                  {delivery === 0 ? "FREE" : `₹${delivery}`}
                </span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="font-bold text-white uppercase tracking-wider font-mono">Total</span>
                <span className="text-xl font-black text-white font-mono">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {savings > 0 && (
              <div className="mt-5 rounded-lg border border-red-950/30 bg-red-950/10 px-4 py-3 text-center">
                <p className="text-sm font-bold text-red-500 font-mono">
                  YOU SAVE ₹{savings.toLocaleString("en-IN")} ON THIS ORDER
                </p>
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-red-600/20 hover:shadow-red-600/40 font-mono"
            >
              {placingOrder ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" /> PLACING ORDER...
                </>
              ) : (
                <>
                  <ShieldCheck size={16} /> PLACE ORDER • ₹{total.toLocaleString("en-IN")}
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-550 font-semibold font-mono">
              <ShieldCheck size={12} className="text-red-500" /> Secure checkout powered by LOCO
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mt-4 rounded-xl border border-red-950/20 bg-red-950/5 p-5 shadow-xs">
            <div className="flex items-start gap-3">
              <Truck size={18} className="mt-0.5 text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white font-mono">Estimated Delivery</p>
                <p className="mt-1 text-xs text-gray-400 leading-relaxed font-mono">
                  {estimatedDelivery.minDate ? `${estimatedDelivery.minDate} — ${estimatedDelivery.maxDate}` : "Calculating estimated delivery..."}
                </p>
              </div>
            </div>
          </div>

          <Link href="/cart" className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400 transition-colors hover:text-white font-mono">
            <ArrowLeft size={14} /> Back to cart
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
