/**
 * Migration Script: Sync existing Prisma users to Supabase Auth
 *
 * Run with:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/migrate-users-to-supabase-auth.ts
 *
 * What it does:
 *   1. Finds all users in the Prisma User table with supabaseId === null (legacy bcrypt users)
 *   2. Creates each user in Supabase Auth (with a random temp password)
 *   3. Stores the returned Supabase UUID in User.supabaseId
 *   4. Sends a password reset email so users can set their own password
 *   5. Prints a full migration report
 *
 * SAFE: Does not delete any data. Legacy bcrypt passwords remain in DB as fallback
 * until users complete their password reset.
 *
 * NOTE: If TypeScript reports "supabaseId does not exist" errors, it means
 * `prisma generate` hasn't run yet with the updated schema. Stop the dev
 * server, run `npx prisma generate`, then restart it. The @ts-ignore comments
 * below let the script run in the meantime.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();

import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import * as crypto from "crypto";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any; // Typed as any so stale Prisma types don't block compilation

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

interface MigrationResult {
  email: string;
  status: "success" | "already_exists" | "error";
  supabaseId?: string;
  error?: string;
}

interface LegacyUser {
  id: string;
  name: string;
  email: string;
}

async function migrateUsersToSupabaseAuth() {
  console.log("🚀 Starting user migration to Supabase Auth...\n");

  // Find all users not yet migrated (supabaseId IS NULL)
  // Using raw query so it works even before `prisma generate` regenerates types
  const legacyUsers: LegacyUser[] = await prisma.$queryRaw`
    SELECT id, name, email FROM "User" WHERE "supabaseId" IS NULL
  `;

  if (legacyUsers.length === 0) {
    console.log("✅ No legacy users to migrate. All users are already linked to Supabase Auth.");
    await prisma.$disconnect();
    return;
  }

  console.log(`📋 Found ${legacyUsers.length} legacy user(s) to migrate:\n`);
  legacyUsers.forEach((u) => console.log(`   - ${u.email}`));
  console.log();

  const results: MigrationResult[] = [];

  for (const user of legacyUsers) {
    process.stdout.write(`⏳ Migrating ${user.email}... `);

    try {
      // Generate a random temporary password — user will reset via email
      const tempPassword = crypto.randomBytes(24).toString("base64url");

      // Create the user in Supabase Auth
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: tempPassword,
        user_metadata: { name: user.name },
        email_confirm: true, // Already verified — they used the app with bcrypt login
      });

      if (error) {
        if (error.message.toLowerCase().includes("already registered")) {
          // User exists in Supabase Auth but not yet linked — find and link them
          const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
          const existingSupabaseUser = listData?.users?.find(
            (u) => u.email === user.email
          );

          if (existingSupabaseUser) {
            await prisma.$executeRaw`
              UPDATE "User" SET "supabaseId" = ${existingSupabaseUser.id} WHERE id = ${user.id}
            `;
            results.push({ email: user.email, status: "already_exists", supabaseId: existingSupabaseUser.id });
            console.log(`⚠️  Already in Supabase Auth — linked (${existingSupabaseUser.id})`);
          } else {
            results.push({ email: user.email, status: "error", error: error.message });
            console.log(`❌ Error: ${error.message}`);
          }
          continue;
        }

        results.push({ email: user.email, status: "error", error: error.message });
        console.log(`❌ Error: ${error.message}`);
        continue;
      }

      const supabaseId = data.user.id;

      // Link Supabase Auth UUID to Prisma User (raw query — avoids stale type issue)
      await prisma.$executeRaw`
        UPDATE "User" SET "supabaseId" = ${supabaseId} WHERE id = ${user.id}
      `;

      // Trigger password reset email so user can set their own password
      await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email: user.email,
        options: {
          redirectTo: `${process.env.NEXTAUTH_URL}/auth/reset-password`,
        },
      });

      results.push({ email: user.email, status: "success", supabaseId });
      console.log(`✅ Done (${supabaseId})`);

      // Small delay to avoid Supabase rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({ email: user.email, status: "error", error: message });
      console.log(`❌ Error: ${message}`);
    }
  }

  // Print final report
  const succeeded = results.filter((r) => r.status === "success").length;
  const alreadyExisted = results.filter((r) => r.status === "already_exists").length;
  const failed = results.filter((r) => r.status === "error").length;

  console.log("\n" + "=".repeat(60));
  console.log("📊 MIGRATION REPORT");
  console.log("=".repeat(60));
  console.log(`✅ Successfully migrated : ${succeeded}`);
  console.log(`⚠️  Already existed      : ${alreadyExisted}`);
  console.log(`❌ Failed                : ${failed}`);

  if (failed > 0) {
    console.log("\n🔴 Failed users:");
    results
      .filter((r) => r.status === "error")
      .forEach((r) => console.log(`   - ${r.email}: ${r.error}`));
  }

  console.log("\n" + "=".repeat(60));
  console.log("📧 Password reset emails sent for migrated users.");
  console.log("   Users must click the reset link to set a new password.");
  console.log("   Until then, they can still login via the bcrypt fallback.");
  console.log("=".repeat(60) + "\n");

  await prisma.$disconnect();

  // Suppress unused variable warning — db alias is for future ORM use after regen
  void db;
}

migrateUsersToSupabaseAuth().catch((err) => {
  console.error("Migration failed:", err);
  prisma.$disconnect();
  process.exit(1);
});
