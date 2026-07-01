const dns = require('dns').promises;

async function resolveDns() {
  const host = 'db.fxocgxuhbixwpdjwhglb.supabase.co';
  console.log("Resolving host:", host);
  try {
    const addresses = await dns.resolve(host, 'ANY');
    console.log("ANY records:", JSON.stringify(addresses, null, 2));
  } catch (e) {
    console.log("ANY failed:", e.message);
  }
  
  try {
    const a = await dns.resolve4(host);
    console.log("IPv4 (A):", a);
  } catch (e) {
    console.log("IPv4 failed:", e.message);
  }

  try {
    const aaaa = await dns.resolve6(host);
    console.log("IPv6 (AAAA):", aaaa);
  } catch (e) {
    console.log("IPv6 failed:", e.message);
  }

  try {
    const cname = await dns.resolveCname(host);
    console.log("CNAME:", cname);
  } catch (e) {
    console.log("CNAME failed:", e.message);
  }
}

resolveDns();
