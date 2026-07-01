"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Zap, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong.", {
          style: { background: "#0a0a0c", color: "#ffffff", border: "1px solid rgba(220, 38, 38, 0.3)" },
        });
      } else {
        setSent(true);
      }
    } catch {
      toast.error("Network error. Please try again.", {
        style: { background: "#0a0a0c", color: "#ffffff", border: "1px solid rgba(220, 38, 38, 0.3)" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12 bg-[#050507]">
      <div className="w-full max-w-md">

        {/* Back */}
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-8 font-mono"
        >
          <ArrowLeft size={14} /> Back to Sign In
        </Link>

        <div className="rounded-2xl border border-red-950/20 bg-[#0a0a0c] shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-red-600 rounded-t-2xl" />
          <div className="p-8">

            {/* Brand */}
            <div className="flex items-center gap-2 mb-8">
              <span className="text-red-600 font-extrabold text-2xl font-serif leading-none">*</span>
              <span className="text-2xl font-black tracking-tighter text-white uppercase font-sans">LOCO</span>
            </div>

            {sent ? (
              /* Success state */
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/20 border border-emerald-500/30 mb-6">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white font-mono mb-3">
                  Check Your Inbox
                </h2>
                <p className="text-sm text-gray-400 font-mono leading-7">
                  If an account with <span className="text-white font-bold">{email}</span> exists, 
                  a password reset link has been sent. The link expires in 60 minutes.
                </p>
                <div className="mt-6 rounded-xl border border-red-950/30 bg-red-950/10 px-4 py-3">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-widest font-mono">
                    Don&apos;t see it? Check your spam folder.
                  </p>
                </div>
                <Link
                  href="/auth"
                  className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-all font-mono"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              /* Form state */
              <>
                <div className="inline-flex items-center gap-2 rounded-full border border-red-950/30 bg-red-950/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-500 font-mono mb-6">
                  <Zap size={12} /> PASSWORD RECOVERY
                </div>

                <h2 className="text-2xl font-black uppercase tracking-tight text-white font-mono mb-2">
                  Reset Password
                </h2>
                <p className="text-sm text-gray-400 font-mono mb-8 leading-6">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      required
                      className="w-full bg-[#0c0c0f] border border-white/10 text-white placeholder-gray-600 pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl hover:bg-red-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-red-600/20 font-mono"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
