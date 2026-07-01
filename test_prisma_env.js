require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');

async function testPrismaEnv() {
  console.log("DATABASE_URL from .env:", process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'));
  const prisma = new PrismaClient();
  try {
    const userCount = await prisma.user.count();
    console.log("✅ Prisma successfully queried DB through pooler! User count:", userCount);
    const users = await prisma.user.findMany({ select: { email: true, name: true } });
    console.log("Users in DB:", users);
  } catch (e) {
    console.error("❌ Prisma query failed:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaEnv();
