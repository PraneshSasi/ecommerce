require('dotenv').config({ path: '.env' });

async function testConnections() {
  // Test 1: Direct connection (current DATABASE_URL with pooler)
  console.log("=== Testing DATABASE_URL (pooler) ===");
  console.log("URL:", process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'));
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient({
      datasources: {
        db: { url: process.env.DATABASE_URL }
      }
    });
    const users = await prisma.user.findMany({ take: 1, select: { email: true } });
    console.log("✅ Pooler connection SUCCESS! Found", users.length, "user(s)");
    if (users[0]) console.log("   First user:", users[0].email);
    await prisma.$disconnect();
  } catch (err) {
    console.error("❌ Pooler connection FAILED:", err.message);
  }

  // Test 2: Direct connection (DIRECT_URL)
  console.log("\n=== Testing DIRECT_URL (direct) ===");
  console.log("URL:", process.env.DIRECT_URL?.replace(/:[^:@]*@/, ':***@'));
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma2 = new PrismaClient({
      datasources: {
        db: { url: process.env.DIRECT_URL }
      }
    });
    const users2 = await prisma2.user.findMany({ take: 1, select: { email: true } });
    console.log("✅ Direct connection SUCCESS! Found", users2.length, "user(s)");
    if (users2[0]) console.log("   First user:", users2[0].email);
    await prisma2.$disconnect();
  } catch (err) {
    console.error("❌ Direct connection FAILED:", err.message);
  }

  // Test 3: Try different pooler regions
  const regions = ['ap-south-1', 'us-east-1', 'eu-west-1', 'ap-southeast-1', 'us-west-1'];
  console.log("\n=== Testing different pooler regions ===");
  for (const region of regions) {
    const url = `postgresql://postgres.fxocgxuhbixwpdjwhglb:Pranesh%401506@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma3 = new PrismaClient({
        datasources: { db: { url } }
      });
      const users3 = await prisma3.user.findMany({ take: 1, select: { email: true } });
      console.log(`✅ Region ${region}: SUCCESS!`);
      await prisma3.$disconnect();
      break; // Found the right one
    } catch (err) {
      console.log(`❌ Region ${region}: ${err.message.substring(0, 80)}`);
    }
  }
}

testConnections().catch(console.error);
