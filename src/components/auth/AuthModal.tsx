"use client";

import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Zap, ArrowRight } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, pendingAction } = useStore();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const { status } = useSession();

  const resetForm = () => {
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setError("");
    setTab("login");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLoading(false);
    setIsEditable(false);
  };

  // Reset form when the modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      resetForm();
    }
  }, [isAuthModalOpen]);

  // Reset form when the user logs out
  useEffect(() => {
    if (status === "unauthenticated") {
      resetForm();
    }
  }, [status]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid email or password.");
        toast.error("Invalid email or password.", {
          style: { background: "#ffffff", color: "#000000", border: "1px solid #e4e4e7" },
        });
      } else {
        toast.success("Welcome back!", {
          style: { background: "#ffffff", color: "#000000", border: "1px solid #e4e4e7" },
          iconTheme: { primary: "#ea580c", secondary: "#ffffff" },
        });
        handleClose();
        if (pendingAction) {
          // Run the pending action (e.g. add to cart / buy now)
          // Don't reload — let the action complete and navigate if needed
          setTimeout(() => pendingAction(), 300);
        } else {
          // No pending action — reload to refresh session state
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.", {
        style: { background: "#ffffff", color: "#000000", border: "1px solid #e4e4e7" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      toast.error("Password must be at least 6 characters.", {
        style: { background: "#ffffff", color: "#000000", border: "1px solid #e4e4e7" },
      });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("check ur password and try again");
      toast.error("check ur password and try again", {
        style: { background: "#ffffff", color: "#000000", border: "1px solid #e4e4e7" },
      });
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        toast.error(data.error || "Registration failed.", {
          style: { background: "#ffffff", color: "#000000", border: "1px solid #e4e4e7" },
        });
        return;
      }
      // Registration successful — Auto-login the user immediately!
      toast.success("Account created! Logging you in...", {
        style: { background: "#ffffff", color: "#000000", border: "1px solid #e4e4e7" },
        iconTheme: { primary: "#ea580c", secondary: "#ffffff" },
      });

      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError("Account created, but automatic login failed. Please sign in manually.");
        setTab("login");
      } else {
        toast.success("Logged in successfully!", {
          style: { background: "#ffffff", color: "#000000", border: "1px solid #e4e4e7" },
          iconTheme: { primary: "#ea580c", secondary: "#ffffff" },
        });
        handleClose();
        if (pendingAction) {
          setTimeout(() => pendingAction(), 300);
        } else {
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.", {
        style: { background: "#ffffff", color: "#000000", border: "1px solid #e4e4e7" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-xs"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-black">
        {/* Top bar */}
        <div className="h-1.5 bg-black" />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-2xl font-black tracking-tighter text-black uppercase font-sans">
              LOCO
            </span>
            <button
              onClick={handleClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-black transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-1">
            {tab === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {tab === "login"
              ? "Sign in to continue shopping"
              : "Join millions of shoppers"}
          </p>

          {/* Tabs */}
          <div className="flex bg-gray-100 border border-gray-200/50 rounded-xl p-1 mb-6">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  tab === t
                    ? "bg-black text-white shadow-xs"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>



          {/* Error */}
          {error && (
            <div className="bg-orange-50 border border-orange-200 text-orange-600 text-sm px-4 py-3 rounded-xl mb-4 font-semibold uppercase tracking-wide">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={tab === "login" ? handleLogin : handleRegister} className="space-y-4">
            {tab === "register" && (
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  readOnly={!isEditable}
                  onFocus={() => setIsEditable(true)}
                  className="w-full bg-gray-50 border border-gray-200 text-black placeholder-gray-400 pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-hidden focus:border-black transition-colors shadow-2xs"
                />
              </div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="off"
                readOnly={!isEditable}
                onFocus={() => setIsEditable(true)}
                className="w-full bg-gray-50 border border-gray-200 text-black placeholder-gray-400 pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-hidden focus:border-black transition-colors shadow-2xs"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="off"
                readOnly={!isEditable}
                onFocus={() => setIsEditable(true)}
                className="w-full bg-gray-50 border border-gray-200 text-black placeholder-gray-400 pl-11 pr-11 py-3 rounded-xl text-sm focus:outline-hidden focus:border-black transition-colors shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {tab === "register" && (
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  readOnly={!isEditable}
                  onFocus={() => setIsEditable(true)}
                  className="w-full bg-gray-50 border border-gray-200 text-black placeholder-gray-400 pl-11 pr-11 py-3 rounded-xl text-sm focus:outline-hidden focus:border-black transition-colors shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            )}

            {tab === "login" && (
              <div className="text-right -mt-1">
                <Link
                  href="/auth/forgot-password"
                  onClick={handleClose}
                  className="text-xs font-semibold text-gray-500 hover:text-black transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold uppercase tracking-wider py-3.5 rounded-xl hover:bg-zinc-800 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-md"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {tab === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {tab === "login" && (
            <div className="mt-6 p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-black text-[10px] text-center font-black uppercase tracking-[0.2em] font-mono">
                ✦ DEMO ACCESS ACCOUNTS
              </p>
              <div className="grid grid-cols-2 gap-3 text-[10px] text-gray-500 font-mono text-center">
                <div className="rounded-xl border border-gray-200 bg-white p-2.5 transition-colors hover:border-gray-300">
                  <span className="block font-black text-black mb-0.5 uppercase tracking-wide">LEO MESSI</span>
                  messi@gmail.com<br/>
                  <span className="text-red-600 font-semibold">Messi@10</span>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-2.5 transition-colors hover:border-gray-300">
                  <span className="block font-black text-black mb-0.5 uppercase tracking-wide">NEYMAR JR</span>
                  neymarjr@gmail.com<br/>
                  <span className="text-red-600 font-semibold">Neymar@10</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

