const { PrismaClient } = require('@prisma/client');

const urls = [
  { label: 'us-east-1 session port 5432', url: 'postgresql://postgres.fxocgxuhbixwpdjwhglb:Pranesh%401506@aws-0-us-east-1.pooler.supabase.com:5432/postgres' },
  { label: 'ap-south-1 session port 5432', url: 'postgresql://postgres.fxocgxuhbixwpdjwhglb:Pranesh%401506@aws-0-ap-south-1.pooler.supabase.com:5432/postgres' },
  { label: 'us-east-1 transaction port 6543', url: 'postgresql://postgres.fxocgxuhbixwpdjwhglb:Pranesh%401506@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1' },
  { label: 'ap-south-1 transaction port 6543', url: 'postgresql://postgres.fxocgxuhbixwpdjwhglb:Pranesh%401506@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1' },
];

async function testAll() {
  for (const { label, url } of urls) {
    const p = new PrismaClient({ datasources: { db: { url } } });
    try {
      const c = await p.product.count();
      console.log('✅ WORKS:', label, '— count:', c);
    } catch (e) {
      const msg = e.message.split('\n').find(l => l.includes("Can't reach") || l.includes("connect") || l.includes("ENOTFOUND") || l.includes("password")) || e.message.split('\n')[0];
      console.log('❌ FAILED:', label, '—', msg.trim());
    } finally {
      await p.$disconnect().catch(() => {});
    }
  }
  process.exit(0);
}

testAll();
