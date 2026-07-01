const https = require('https');

// Simple IPv6 CIDR matcher
function ipv6InRange(ip, cidr) {
  // Convert IP and CIDR to BigInt representation for comparison
  try {
    const [range, bitsStr] = cidr.split('/');
    const bits = parseInt(bitsStr, 10);
    
    const ipInt = ipv6ToBigInt(ip);
    const rangeInt = ipv6ToBigInt(range);
    
    const mask = (1n << 128n) - (1n << (128n - BigInt(bits)));
    return (ipInt & mask) === (rangeInt & mask);
  } catch (e) {
    return false;
  }
}

function ipv6ToBigInt(ip) {
  // Expand ::
  let fullIp = ip;
  if (ip.includes('::')) {
    const parts = ip.split('::');
    const left = parts[0] ? parts[0].split(':') : [];
    const right = parts[1] ? parts[1].split(':') : [];
    const missing = 8 - (left.length + right.length);
    const middle = new Array(missing).fill('0');
    fullIp = [...left, ...middle, ...right].join(':');
  }
  const segments = fullIp.split(':').map(x => x === '' ? 0 : parseInt(x, 16));
  let result = 0n;
  for (const seg of segments) {
    result = (result << 16n) + BigInt(seg);
  }
  return result;
}

https.get('https://ip-ranges.amazonaws.com/ip-ranges.json', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const targetIp = '2406:da12:1f1:f802:7237:ccc0:23bc:eceb';
    console.log("Searching for AWS region for IP:", targetIp);
    
    let matches = [];
    for (const prefix of json.ipv6_prefixes) {
      if (ipv6InRange(targetIp, prefix.ipv6_prefix)) {
        matches.push(prefix);
      }
    }
    
    console.log("Matches:", JSON.stringify(matches, null, 2));
  });
}).on('error', (err) => {
  console.error("Error fetching AWS ranges:", err);
});
