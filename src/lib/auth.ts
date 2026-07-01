import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabaseServer";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[Auth] authorize() called. Email:", credentials?.email ? "provided" : "missing");
        if (!credentials?.email || !credentials?.password) {
          console.error("[Auth] Missing email or password in credentials");
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find user in Prisma by email
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // If not in Prisma, check if they can authenticate via Supabase Auth
          console.log("[Auth] User not found in Prisma. Attempting authentication via Supabase Auth directly...");
          let signInResult = await supabaseServer.auth.signInWithPassword({
            email,
            password,
          });

          // Handle unconfirmed email
          if (signInResult.error && signInResult.error.message.toLowerCase().includes("email not confirmed")) {
            console.log("[Auth] Email not confirmed for new Prisma user. Attempting administrative confirmation...");
            // Get user by email to get their ID
            const { data: userData } = await supabaseServer.auth.admin.listUsers();
            const existingSupabaseUser = userData?.users?.find(u => u.email === email);
            if (existingSupabaseUser) {
              const { error: confirmError } = await supabaseServer.auth.admin.updateUserById(
                existingSupabaseUser.id,
                { email_confirm: true }
              );
              if (!confirmError) {
                console.log("[Auth] Email confirmed. Retrying signIn...");
                signInResult = await supabaseServer.auth.signInWithPassword({
                  email,
                  password,
                });
              } else {
                console.error("[Auth] Failed to administratively confirm email:", confirmError.message);
              }
            }
          }

          if (!signInResult.error && signInResult.data.user) {
            const supabaseUser = signInResult.data.user;
            console.log("[Auth] Successfully authenticated via Supabase. Re-syncing to Prisma...");
            
            // Create user in Prisma
            const hashedPassword = await bcrypt.hash(password, 12);
            user = await prisma.user.create({
              data: {
                id: supabaseUser.id, // Use the Supabase Auth UUID as the primary database key
                supabaseId: supabaseUser.id,
                name: supabaseUser.user_metadata?.name || "Supabase User",
                email: supabaseUser.email || email,
                password: hashedPassword,
              },
            });
          } else {
            console.log("[Auth] Supabase direct authentication failed:", signInResult.error?.message);
            return null;
          }
        }

        // ---------------------------------------------------------
        // PATH A: Supabase Auth user (supabaseId is set)
        // ---------------------------------------------------------
        if (user.supabaseId) {
          let signInResult = await supabaseServer.auth.signInWithPassword({
            email,
            password,
          });

          // If the email is not confirmed, confirm it administratively and retry sign-in
          if (signInResult.error && signInResult.error.message.toLowerCase().includes("email not confirmed")) {
            console.log("[Auth] Email not confirmed. Administratively confirming email...");
            const { error: confirmError } = await supabaseServer.auth.admin.updateUserById(
              user.supabaseId,
              { email_confirm: true }
            );

            if (!confirmError) {
              console.log("[Auth] Email confirmed. Retrying signIn...");
              signInResult = await supabaseServer.auth.signInWithPassword({
                email,
                password,
              });
            } else {
              console.error("[Auth] Failed to administratively confirm email:", confirmError.message);
            }
          }

          if (!signInResult.error) {
            // Sign in succeeded. Now let's check if the password hash matches the one in Prisma.
            // If it is missing or doesn't match, sync the database hash.
            let needsDbUpdate = false;
            if (!user.password) {
              needsDbUpdate = true;
            } else {
              const isBcryptValid = await bcrypt.compare(password, user.password);
              if (!isBcryptValid) {
                needsDbUpdate = true;
              }
            }

            if (needsDbUpdate) {
              console.log("[Auth] Syncing password hash to local Prisma database...");
              const hashedPassword = await bcrypt.hash(password, 12);
              await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
              });
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }

          console.warn("[Auth] Supabase signIn failed:", signInResult.error.message);

          // If Supabase sign-in failed (e.g. user was migrated with a temp password),
          // check if they have a legacy bcrypt password and if it matches.
          if (user.password) {
            const isBcryptValid = await bcrypt.compare(password, user.password);
            if (isBcryptValid) {
              console.log("[Auth] Legacy bcrypt password matches. Syncing password to Supabase Auth...");
              // Update the password in Supabase Auth to match their current password
              const { error: updateError } = await supabaseServer.auth.admin.updateUserById(
                user.supabaseId,
                { password }
              );

              if (updateError) {
                console.error("[Auth] Failed to sync password to Supabase:", updateError.message);
                return null;
              }

              console.log("[Auth] Password synced successfully. Retrying Supabase signIn...");
              const { error: retryError } = await supabaseServer.auth.signInWithPassword({
                email,
                password,
              });

              if (!retryError) {
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                };
              }
            }
          }

          console.error("[Auth] All authentication paths failed for user with supabaseId:", user.supabaseId);
          return null;
        }

        // ---------------------------------------------------------
        // PATH B: Legacy user (no supabaseId) — Dynamic Migration
        // ---------------------------------------------------------
        if (user.password) {
          const isBcryptValid = await bcrypt.compare(password, user.password);
          if (isBcryptValid) {
            console.log("[Auth] Dynamic migration: User authenticated via bcrypt. Migrating to Supabase...");
            
            // Check if user already exists in Supabase Auth
            let supabaseId = "";
            const { data: listData } = await supabaseServer.auth.admin.listUsers();
            const existingSupabaseUser = listData?.users?.find(u => u.email === email);

            if (existingSupabaseUser) {
              supabaseId = existingSupabaseUser.id;
              // Sync password to the one they just entered
              await supabaseServer.auth.admin.updateUserById(supabaseId, { password });
            } else {
              // Create user in Supabase Auth
              const { data: createData, error: createError } = await supabaseServer.auth.admin.createUser({
                email,
                password,
                user_metadata: { name: user.name },
                email_confirm: true,
              });

              if (createError) {
                console.error("[Auth] Failed to dynamically create user in Supabase Auth:", createError.message);
                // Still allow login since bcrypt matched, but don't link yet
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                };
              }
              supabaseId = createData.user.id;
            }

            // Link in Prisma database
            await prisma.user.update({
              where: { id: user.id },
              data: { supabaseId },
            });

            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }
        }

        console.error("[Auth] All authentication paths exhausted. Login failed for:", email);
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
