import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabaseServer";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists in Prisma
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // -------------------------------------------------------
    // Step 1: Create user in Supabase Auth
    // Using admin.createUser so we control email confirmation
    // -------------------------------------------------------
    const { data: supabaseData, error: supabaseError } =
      await supabaseServer.auth.admin.createUser({
        email,
        password,
        user_metadata: { name },
        email_confirm: true, // Auto-confirm email so no verification link is sent and user can log in immediately
      });

    if (supabaseError) {
      console.error("[Register] Supabase Auth error:", supabaseError.message);
      // If it's a duplicate in Supabase but not in Prisma, treat as already-registered
      if (supabaseError.message.toLowerCase().includes("already registered")) {
        return NextResponse.json(
          { error: "User already exists with this email" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: `Auth service error: ${supabaseError.message}` },
        { status: 500 }
      );
    }

    const supabaseUserId = supabaseData.user.id;

    // Hash the password for the local Prisma database
    const hashedPassword = await bcrypt.hash(password, 12);

    // -------------------------------------------------------
    // Step 2: Create/Update the Prisma User row, linked via supabaseId
    // We save the bcrypt hash locally in the User table as requested.
    // Using upsert handles cases where the DB trigger already created the User row.
    // -------------------------------------------------------
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        supabaseId: supabaseUserId,
        password: hashedPassword,
        name,
      },
      create: {
        id: supabaseUserId,
        supabaseId: supabaseUserId,
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
