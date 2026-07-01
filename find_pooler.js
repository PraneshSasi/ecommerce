require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

const projectRef = 'fxocgxuhbixwpdjwhglb';
const password = 'Pranesh@1506';

const regions = [
  'ap-south-1', 'us-east-1', 'us-west-1', 'us-west-2',
  'eu-west-1', 'eu-central-1', 'ap-southeast-1', 'ap-northeast-1',
  'sa-east-1', 'ca-central-1'
];

async function test() {
  for (const region of regions) {
    const connStr = `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:6543/postgres`;
    const client = new Client({ 
      connectionString: connStr, 
      connectionTimeoutMillis: 5000,
      ssl: { rejectUnauthorized: false }
    });
    try {
      await client.connect();
      const res = await client.query('SELECT 1 as test');
      console.log(`✅ FOUND! Region: ${region}`);
      console.log(`   Pooler URL: postgresql://postgres.${projectRef}:[PASSWORD]@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`);
      await client.end();
      return;
    } catch (err) {
      const msg = (err.message || '').substring(0, 80);
      console.log(`❌ ${region}: ${msg}`);
      try { await client.end(); } catch {}
    }
  }
  console.log("\nNo region found via transaction mode. Trying session mode (port 5432)...");
  for (const region of regions) {
    const connStr = `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:5432/postgres`;
    const client = new Client({ 
      connectionString: connStr, 
      connectionTimeoutMillis: 5000,
      ssl: { rejectUnauthorized: false }
    });
    try {
      await client.connect();
      console.log(`✅ Session mode FOUND! Region: ${region}`);
      await client.end();
      return;
    } catch (err) {
      const msg = (err.message || '').substring(0, 80);
      console.log(`❌ ${region} (session): ${msg}`);
      try { await client.end(); } catch {}
    }
  }
}

test().catch(console.error);
