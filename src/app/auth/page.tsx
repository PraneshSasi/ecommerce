"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

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
        setError("Invalid email or password. Try demo@shopwave.com / demo1234");
        toast.error("Invalid email or password.", {
          style: { background: "#ffffff", color: "#ef4444", border: "1px solid #fee2e2" },
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.success("Welcome back!", {
          style: { background: "#ffffff", color: "#1f2937", border: "1px solid #e5e7eb" },
        });
        setTimeout(() => {
          router.push(callbackUrl);
          setTimeout(() => window.location.reload(), 100);
        }, 1200);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.", {
        style: { background: "#ffffff", color: "#ef4444", border: "1px solid #fee2e2" },
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      toast.error("Password must be at least 6 characters.", {
        style: { background: "#ffffff", color: "#ef4444", border: "1px solid #fee2e2" },
      });
      setTimeout(() => {
        window.location.reload();
      }, 1550);
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
          style: { background: "#ffffff", color: "#ef4444", border: "1px solid #fee2e2" },
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return;
      }

      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (!signInRes?.error) {
        toast.success("Account created!", {
          style: { background: "#ffffff", color: "#1f2937", border: "1px solid #e5e7eb" },
        });
        setTimeout(() => {
          router.push(callbackUrl);
          setTimeout(() => window.location.reload(), 100);
        }, 1200);
      } else {
        setTab("login");
        toast.success("Account created. Please sign in.");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.", {
        style: { background: "#ffffff", color: "#ef4444", border: "1px solid #fee2e2" },
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <div className="space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 cursor-pointer">
          <ArrowLeft size={16} /> Back to shop
        </Link>

        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-150 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700">
            <Zap size={14} /> ShopWave account
          </div>
          <h1 className="max-w-xl text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            Sign in faster. Check out faster. Keep everything in one place.
          </h1>
          <p className="max-w-xl text-base leading-7 text-gray-600">
            Manage orders, save items to your cart, and move through the store with a consistent experience on every screen.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Secure sign in", text: "Protected sessions" },
            { icon: Truck, title: "Order tracking", text: "Stay updated" },
            { icon: CreditCard, title: "Quick checkout", text: "Save time at payment" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Icon size={18} />
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-900">{title}</p>
              <p className="mt-1 text-sm leading-6 text-gray-500">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-md">
        <div className="h-1.5 rounded-t-2xl bg-indigo-600" />
        <div className="p-6 sm:p-8">
          <Link href="/" className="mb-8 inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-600">
              <Zap size={18} />
            </div>
            <span className="text-lg font-semibold text-gray-900">ShopWave</span>
          </Link>

          <h2 className="text-2xl font-bold text-gray-950">
            {tab === "login" ? "Sign in to your account" : "Create a new account"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {tab === "login" ? "No account yet? " : "Already have an account? "}
            <button
              onClick={() => {
                setTab(tab === "login" ? "register" : "login");
                setError("");
              }}
              className="font-semibold text-indigo-600 transition-colors hover:text-indigo-750 cursor-pointer"
            >
              {tab === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>

          <div className="mt-6 flex bg-gray-100 rounded-xl p-1">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setError("");
                }}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                  tab === t
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={tab === "login" ? handleLogin : handleRegister} className="mt-5 space-y-4">
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
                  className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 transition-colors shadow-2xs"
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
                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 transition-colors shadow-2xs"
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
                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-450 pl-11 pr-11 py-3 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 transition-colors shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer shadow-xs"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white" />
              ) : (
                <>
                  {tab === "login" ? "Sign In" : "Create Account"} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {tab === "login" && (
            <div className="mt-5 rounded-xl border border-indigo-150 bg-indigo-50 px-4 py-3 text-center text-xs text-indigo-700 font-semibold">
              <span className="font-bold">Demo credentials:</span> demo@shopwave.com / demo1234
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
