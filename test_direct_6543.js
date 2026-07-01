const { Client } = require('pg');

async function testDirect6543() {
  const config = {
    host: 'db.fxocgxuhbixwpdjwhglb.supabase.co',
    port: 6543,
    user: 'postgres', // direct user, not pooler user
    password: 'Pranesh@1506',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  };

  console.log("Testing direct host on port 6543 with user postgres...");
  let client = new Client(config);
  try {
    await client.connect();
    console.log("✅ CONNECTED to 6543 direct!");
    const res = await client.query("SELECT current_user, current_database()");
    console.log("Result:", res.rows[0]);
    await client.end();
  } catch (e) {
    console.error("❌ 6543 direct FAILED:", e.message);
  }

  console.log("\nTesting direct host on port 6543 with user postgres.fxocgxuhbixwpdjwhglb...");
  let client2 = new Client({ ...config, user: 'postgres.fxocgxuhbixwpdjwhglb' });
  try {
    await client2.connect();
    console.log("✅ CONNECTED to 6543 direct (with tenant user)!");
    const res = await client2.query("SELECT current_user, current_database()");
    console.log("Result:", res.rows[0]);
    await client2.end();
  } catch (e) {
    console.error("❌ 6543 direct (tenant user) FAILED:", e.message);
  }
}

testDirect6543().catch(console.error);
