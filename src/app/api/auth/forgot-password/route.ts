import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Use Supabase Admin to send password reset email.
    // This works regardless of whether the user has verified their email.
    const { error } = await supabaseServer.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${process.env.NEXTAUTH_URL}/auth/reset-password`,
      },
    });

    if (error) {
      console.error("[ForgotPassword] Error:", error.message);
      // Return a generic success message even on error to prevent email enumeration
    }

    // Always return success to avoid leaking whether the email exists
    return NextResponse.json({
      message: "If an account exists with that email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
