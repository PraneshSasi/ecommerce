"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Phone, MapPin, Camera, Save, RefreshCw, Cpu, Activity, Shield, Key, Calendar, Hash, Package, Clock, CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Spinner from "@/components/ui/Spinner";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string | null;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  supabaseId?: string | null;
  createdAt?: string;
}

interface ToolInfo {
  name: string;
  description: string;
}

interface AgentInfo {
  name: string;
  type: string;
  status: string;
  tools: ToolInfo[];
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    title: string;
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

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    avatarUrl: null,
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    supabaseId: null,
    createdAt: "",
  });

  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.name || "",
          email: data.email || "",
          avatarUrl: data.avatarUrl || null,
          phone: data.phone || "",
          addressLine: data.addressLine || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          supabaseId: data.supabaseId || null,
          createdAt: data.createdAt || "",
        });
        if (data.avatarUrl) {
          setAvatarPreview(data.avatarUrl);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth?callbackUrl=/profile");
      return;
    }
    if (status === "authenticated") {
      void fetchProfile();
    }
  }, [status, fetchProfile, router]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/agents");
        if (res.ok) {
          const data = await res.json();
          setAgents(data);
        }
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      } finally {
        setLoadingAgents(false);
      }
    };
    if (status === "authenticated") {
      void fetchAgents();
    }
  }, [status]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (status === "authenticated") {
      void fetchOrders();
    }
  }, [status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image file must be under 4MB");
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error("File must be an image");
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const toastId = toast.loading("Updating your user registry...");

    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("phone", profile.phone);
      formData.append("addressLine", profile.addressLine);
      formData.append("city", profile.city);
      formData.append("state", profile.state);
      formData.append("pincode", profile.pincode);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await fetch("/api/user/profile", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const data = await res.json();
      setProfile({
        name: data.user.name || "",
        email: data.user.email || "",
        avatarUrl: data.user.avatarUrl || null,
        phone: data.user.phone || "",
        addressLine: data.user.addressLine || "",
        city: data.user.city || "",
        state: data.user.state || "",
        pincode: data.user.pincode || "",
        supabaseId: data.user.supabaseId || null,
        createdAt: data.user.createdAt || "",
      });

      if (data.user.avatarUrl) {
        setAvatarPreview(data.user.avatarUrl);
      }

      // Update next-auth session to reflect name changes
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: data.user.name,
        },
      });

      toast.success("Profile updated successfully on network", { id: toastId });
    } catch (error: unknown) {
      console.error("Profile update failed:", error);
      toast.error(error instanceof Error ? error.message : "Profile update failed", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#050507] text-white px-4">
        <div className="rounded-2xl border border-red-950/20 bg-[#0a0a0c] px-8 py-12 text-center shadow-xl max-w-sm">
          <Spinner size={40} />
          <p className="mt-4 text-xs font-black uppercase tracking-[0.25em] text-red-500/70 font-mono">Retrieving identity data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Back Link */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-white cursor-pointer select-none font-mono"
        >
          <ArrowLeft size={14} /> Return to collection
        </button>

        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500 font-mono">✦ SECURE USER DEPLOYMENT</p>
          <h1 className="text-4xl font-black uppercase tracking-tight text-white leading-none font-mono">USER REGISTRY</h1>
          <p className="mt-1 text-xs font-bold text-gray-405 uppercase tracking-widest font-mono">
            Manage your personal profile details and database shipping records
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12">
          {/* Left Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Avatar Card */}
            <div className="flex flex-col items-center justify-center rounded-[24px] border border-red-950/20 bg-[#0a0a0c] p-8 shadow-2xl text-center">
              <h4 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 mb-6 font-mono self-start">
                <Camera size={12} className="text-red-500/60" /> REGISTRY AVATAR
              </h4>

              <div className="relative group cursor-pointer mb-6" onClick={() => fileInputRef.current?.click()}>
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-red-950/40 bg-red-950/10 flex items-center justify-center">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt={profile.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User size={64} className="text-white/30" />
                  )}
                  {/* Upload Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={20} className="text-white mb-1" />
                    <span className="text-[9px] font-black tracking-widest uppercase">Upload</span>
                  </div>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <h3 className="text-lg font-black text-white uppercase tracking-wider font-mono">{profile.name || "UNNAMED USER"}</h3>
              <p className="mt-1 text-xs text-white/50 font-mono tracking-wider">{profile.email}</p>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-6 inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all hover:border-white hover:text-white cursor-pointer font-mono"
              >
                Modify Image
              </button>

              <p className="mt-4 text-[9px] text-gray-600 font-mono uppercase tracking-widest leading-relaxed">
                Accepts JPEG, PNG, or WebP. Max 4MB size. Hosted securely on Supabase Storage.
              </p>
            </div>

            {/* Supabase Identity Card */}
            <div className="rounded-[24px] border border-red-950/20 bg-[#0a0a0c] p-8 shadow-2xl space-y-6">
              <h4 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 font-mono">
                <Shield size={12} className="text-red-500/60" /> SUPABASE IDENTITY
              </h4>

              <div className="space-y-4 font-mono text-[10px]">
                <div className="space-y-1.5">
                  <span className="text-gray-500 font-bold uppercase tracking-wider block">AUTH REFERENCE UUID</span>
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-white truncate select-all" title={profile.supabaseId || "N/A"}>
                    <Key size={10} className="text-red-500/60" />
                    <span className="truncate">{profile.supabaseId || "LEGACY_CREDENTIALS"}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-gray-500 font-bold uppercase tracking-wider block">CREATION DATE</span>
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-white">
                    <Calendar size={10} className="text-red-500/60" />
                    <span>
                      {profile.createdAt 
                        ? new Date(profile.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) 
                        : "NOT RECORDED"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-gray-500 font-bold uppercase tracking-wider block">ACCESS POLICY</span>
                  <div className="flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2 text-emerald-400">
                    <Shield size={10} className="animate-pulse" />
                    <span className="uppercase tracking-widest font-black">RLS ENABLED // SECURED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Form Fields Card */}
            <div className="rounded-[24px] border border-red-950/20 bg-[#0a0a0c] p-8 shadow-2xl space-y-8">
              {/* Personal Details */}
              <div>
                <h4 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 mb-6 font-mono">
                  <User size={12} className="text-red-500/60" /> PERSONAL INFORMATION
                </h4>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 leading-none font-mono">FULL NAME</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 px-4 text-xs text-white placeholder:text-white/20 outline-none transition-all focus:border-white/20 focus:bg-white/10 uppercase tracking-widest font-black"
                      placeholder="ENTER FULL NAME"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 leading-none font-mono">EMAIL ADDRESS (SECURED)</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full rounded-xl border border-white/5 bg-white/[0.02] py-3.5 px-4 text-xs text-white/40 cursor-not-allowed outline-none uppercase tracking-widest font-black font-mono"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 leading-none font-mono flex items-center gap-1">
                      <Phone size={10} /> CONTACT PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 px-4 text-xs text-white placeholder:text-white/20 outline-none transition-all focus:border-white/20 focus:bg-white/10 uppercase tracking-widest font-black"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t border-white/5 pt-8">
                <h4 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 mb-6 font-mono">
                  <MapPin size={12} className="text-red-500/60" /> DEFAULT SHIPPING DESTINATION
                </h4>

                <div className="grid gap-6 md:grid-cols-6">
                  <div className="space-y-2 md:col-span-6">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 leading-none font-mono">STREET ADDRESS</label>
                    <input
                      type="text"
                      name="addressLine"
                      value={profile.addressLine}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 px-4 text-xs text-white placeholder:text-white/20 outline-none transition-all focus:border-white/20 focus:bg-white/10 uppercase tracking-widest font-black"
                      placeholder="HOUSE NO, APARTMENT, STREET NAME"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 leading-none font-mono">CITY</label>
                    <input
                      type="text"
                      name="city"
                      value={profile.city}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 px-4 text-xs text-white placeholder:text-white/20 outline-none transition-all focus:border-white/20 focus:bg-white/10 uppercase tracking-widest font-black"
                      placeholder="CITY"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 leading-none font-mono">STATE</label>
                    <input
                      type="text"
                      name="state"
                      value={profile.state}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 px-4 text-xs text-white placeholder:text-white/20 outline-none transition-all focus:border-white/20 focus:bg-white/10 uppercase tracking-widest font-black"
                      placeholder="STATE"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 leading-none font-mono">POSTAL PINCODE</label>
                    <input
                      type="text"
                      name="pincode"
                      value={profile.pincode}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 px-4 text-xs text-white placeholder:text-white/20 outline-none transition-all focus:border-white/20 focus:bg-white/10 uppercase tracking-widest font-black"
                      placeholder="123456"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <div className="border-t border-white/5 pt-8 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 justify-center rounded-full bg-white px-8 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-slate-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Saving Registry...
                    </>
                  ) : (
                    <>
                      <Save size={14} /> Commit Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Active Logistics & Orders Card */}
            <div className="rounded-[24px] border border-red-950/20 bg-[#0a0a0c] p-8 shadow-2xl space-y-6">
              <h4 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 font-mono">
                <Package size={12} className="text-red-500/60" /> ACTIVE LOGISTICS & ORDERS
              </h4>

              {loadingOrders ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <RefreshCw size={20} className="animate-spin text-red-500/50 mb-2" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 font-mono">Retrieving order logs...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                  <p className="text-xs text-white/30 uppercase tracking-widest font-mono">No order transaction logs found.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-hide">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-white/5 bg-white/[0.01] hover:border-red-950/20 rounded-2xl p-4 space-y-3 transition-colors font-mono">
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-white font-bold flex items-center gap-1.5">
                          <Hash size={10} className="text-red-500/60" /> {order.id.slice(0, 10).toUpperCase()}...
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-black uppercase tracking-widest text-[8px] border ${
                          order.status.toLowerCase() === "delivered" 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs border-y border-white/5 py-2">
                        <div className="text-[9px] text-gray-500 space-y-0.5">
                          <div>DATE: {new Date(order.createdAt).toLocaleDateString("en-IN")}</div>
                          <div>ITEMS: {order.items.reduce((acc, curr) => acc + curr.quantity, 0)} UNITS</div>
                        </div>
                        <div className="font-black text-red-500">₹{order.total.toLocaleString("en-IN")}</div>
                      </div>

                      <div className="text-[9px] text-gray-400 leading-relaxed">
                        <span className="text-gray-500 font-bold block mb-0.5">SHIPPING DESTINATION:</span>
                        {order.fullName} · {order.addressLine}, {order.city}, {order.state} - {order.pincode}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* AI AGENTS & MCP SERVICES */}
        <div className="rounded-[24px] border border-red-950/20 bg-[#0a0a0c] p-8 shadow-2xl space-y-6 mt-8">
          <div className="flex flex-col gap-1.5">
            <h4 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 font-mono">
              <Cpu size={12} className="text-red-500/60" /> SYSTEM AI AGENTS & SERVICES
            </h4>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-mono">
              Model Context Protocol (MCP) servers and AI agents configured to access and modify workspace resources
            </p>
          </div>

          {loadingAgents ? (
            <div className="flex flex-col items-center justify-center py-16 border border-white/5 rounded-2xl bg-white/[0.01]">
              <RefreshCw size={24} className="animate-spin text-red-500/50 mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 font-mono">Scanning system registry for agents...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <p className="text-xs text-white/30 uppercase tracking-widest font-mono">No active agents or MCP services registered.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <div key={agent.name} className="relative group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] hover:border-red-950/40 hover:bg-white/[0.03] transition-all p-5 flex flex-col justify-between min-h-[220px]">
                  {/* Hex Grid Background Effect */}
                  <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300">
                    <svg className="w-full h-full text-red-500" xmlns="http://www.w3.org/2000/svg">
                      <pattern id={`grid-${agent.name}`} width="12" height="12" patternUnits="userSpaceOnUse">
                        <path d="M 12 0 L 0 0 0 12" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      </pattern>
                      <rect width="100%" height="100%" fill={`url(#grid-${agent.name})`} />
                    </svg>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-950/20 bg-red-950/10 text-red-500">
                          <Cpu size={14} />
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-white uppercase tracking-wider font-mono">{agent.name}</h5>
                          <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 font-mono">{agent.type}</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20 font-mono">
                        <Activity size={8} className="animate-pulse" /> {agent.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 font-mono">Registered Capabilities:</span>
                      <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto scrollbar-hide">
                        {agent.tools.map((tool) => (
                          <span key={tool.name} title={tool.description} className="rounded bg-white/5 border border-white/5 px-2 py-0.5 text-[9px] font-bold text-white/70 uppercase tracking-wider font-mono hover:bg-white/10 hover:text-white cursor-help transition-all">
                            {tool.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[8px] text-gray-500 font-mono uppercase tracking-widest relative z-10">
                    <span>Access: APPROVED</span>
                    <span className="text-red-500/60 font-black">SYS.NODE_ID: {agent.name.slice(0, 3).toUpperCase()}-{(agent.tools.length * 17 + 100).toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
