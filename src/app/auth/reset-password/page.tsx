"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle, Zap } from "lucide-react";
import { supabaseClient } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState("");
  const [success, setSuccess] = useState(false);

  // Supabase sends the recovery token as a hash fragment (#access_token=...)
  // OR as query params (?code=...) depending on the flow type.
  // We listen for the auth state change which Supabase SDK handles automatically.
  useEffect(() => {
    // Handle hash-based tokens (PKCE or implicit flow from Supabase emails)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const type = hashParams.get("type");

    // Also handle query-param based code (newer Supabase PKCE flow)
    const code = searchParams.get("code");

    const restoreSession = async () => {
      if (code) {
        // Exchange code for session
        const { error } = await supabaseClient.auth.exchangeCodeForSession(code);
        if (error) {
          setSessionError("Invalid or expired reset link. Please request a new one.");
        } else {
          setSessionReady(true);
        }
        return;
      }

      if (accessToken && refreshToken && type === "recovery") {
        // Set session from tokens in hash
        const { error } = await supabaseClient.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          setSessionError("Invalid or expired reset link. Please request a new one.");
        } else {
          setSessionReady(true);
        }
        return;
      }

      // Check if there's already an active session (user clicked link in same browser)
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) {
        setSessionReady(true);
      } else {
        setSessionError("No valid reset session found. Please request a new password reset link.");
      }
    };

    void restoreSession();
  }, [searchParams]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.", {
        style: { background: "#0a0a0c", color: "#ffffff", border: "1px solid rgba(220, 38, 38, 0.3)" },
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", {
        style: { background: "#0a0a0c", color: "#ffffff", border: "1px solid rgba(220, 38, 38, 0.3)" },
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabaseClient.auth.updateUser({ password });

      if (error) {
        toast.error(error.message || "Failed to update password.", {
          style: { background: "#0a0a0c", color: "#ffffff", border: "1px solid rgba(220, 38, 38, 0.3)" },
        });
        return;
      }

      setSuccess(true);
      toast.success("Password updated! Redirecting to sign in...", {
        style: { background: "#0a0a0c", color: "#ffffff", border: "1px solid rgba(34, 197, 94, 0.3)" },
      });

      // Sign out from Supabase session (NextAuth manages its own session)
      await supabaseClient.auth.signOut();

      setTimeout(() => {
        router.push("/auth");
      }, 2500);
    } catch {
      toast.error("Something went wrong. Please try again.", {
        style: { background: "#0a0a0c", color: "#ffffff", border: "1px solid rgba(220, 38, 38, 0.3)" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12 bg-[#050507]">
      <div className="w-full max-w-md">

        <div className="rounded-2xl border border-red-950/20 bg-[#0a0a0c] shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-red-600 rounded-t-2xl" />
          <div className="p-8">

            {/* Brand */}
            <div className="flex items-center gap-2 mb-8">
              <span className="text-red-600 font-extrabold text-2xl font-serif leading-none">*</span>
              <span className="text-2xl font-black tracking-tighter text-white uppercase font-sans">LOCO</span>
            </div>

            {/* Session Error */}
            {sessionError && (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-950/20 border border-red-950/30 mb-6">
                  <XCircle size={32} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white font-mono mb-3">
                  Link Expired
                </h2>
                <p className="text-sm text-gray-400 font-mono leading-7 mb-6">{sessionError}</p>
                <Link
                  href="/auth/forgot-password"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-all font-mono"
                >
                  Request New Link
                </Link>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/20 border border-emerald-500/30 mb-6">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white font-mono mb-3">
                  Password Updated!
                </h2>
                <p className="text-sm text-gray-400 font-mono leading-7">
                  Your password has been changed. Redirecting to sign in...
                </p>
              </div>
            )}

            {/* Reset Form */}
            {!sessionError && !success && sessionReady && (
              <>
                <div className="inline-flex items-center gap-2 rounded-full border border-red-950/30 bg-red-950/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-500 font-mono mb-6">
                  <Zap size={12} /> SET NEW PASSWORD
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white font-mono mb-2">
                  New Password
                </h2>
                <p className="text-sm text-gray-400 font-mono mb-8 leading-6">
                  Choose a strong password — at least 6 characters.
                </p>

                <form onSubmit={handleReset} className="space-y-4">
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New password"
                      required
                      className="w-full bg-[#0c0c0f] border border-white/10 text-white placeholder-gray-600 pl-11 pr-11 py-3 rounded-xl text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
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
                      "Update Password"
                    )}
                  </button>
                </form>
              </>
            )}

            {/* Loading state while establishing session */}
            {!sessionError && !success && !sessionReady && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-500 font-mono">
                  Verifying reset link...
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
