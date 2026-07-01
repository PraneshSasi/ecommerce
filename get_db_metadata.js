const { Client } = require('pg');

async function getDbMetadata() {
  const config = {
    host: 'db.fxocgxuhbixwpdjwhglb.supabase.co',
    port: 5432,
    user: 'postgres',
    password: 'Pranesh@1506',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  };

  console.log("Connecting directly to database to query metadata...");
  const client = new Client(config);
  try {
    await client.connect();
    
    // Get timezone
    const tzRes = await client.query("SHOW timezone");
    console.log("Timezone:", tzRes.rows[0]);
    
    // Get version
    const verRes = await client.query("SELECT version()");
    console.log("Version:", verRes.rows[0].version);
    
    // Get current time
    const timeRes = await client.query("SELECT now()");
    console.log("Current DB Time:", timeRes.rows[0].now);
    
    // Get system/network settings if possible
    try {
      const inetRes = await client.query("SELECT inet_server_addr(), inet_client_addr()");
      console.log("Server IP:", inetRes.rows[0].inet_server_addr);
      console.log("Client IP:", inetRes.rows[0].inet_client_addr);
    } catch (e) {
      console.log("Could not query inet address:", e.message);
    }

    await client.end();
  } catch (e) {
    console.error("Direct connection failed:", e.message);
  }
}

getDbMetadata().catch(console.error);
