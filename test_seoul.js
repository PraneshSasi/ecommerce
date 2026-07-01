const { Client } = require('pg');

async function testSeoul() {
  const config = {
    host: 'aws-1-ap-northeast-2.pooler.supabase.com',
    port: 6543,
    user: 'postgres.fxocgxuhbixwpdjwhglb',
    password: 'Pranesh@1506',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  };

  console.log("Testing ap-northeast-2 on port 6543...");
  let client = new Client(config);
  try {
    await client.connect();
    console.log("✅ CONNECTED to 6543!");
    const res = await client.query("SELECT current_user, current_database()");
    console.log("Result:", res.rows[0]);
    await client.end();
  } catch (e) {
    console.error("❌ 6543 FAILED:", e.message);
  }

  console.log("\nTesting ap-northeast-2 on port 5432...");
  let client2 = new Client({ ...config, port: 5432 });
  try {
    await client2.connect();
    console.log("✅ CONNECTED to 5432!");
    const res = await client2.query("SELECT current_user, current_database()");
    console.log("Result:", res.rows[0]);
    await client2.end();
  } catch (e) {
    console.error("❌ 5432 FAILED:", e.message);
  }
}

testSeoul().catch(console.error);
