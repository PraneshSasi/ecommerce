require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data: listData } = await supabase.auth.admin.listUsers();
  
  const messi = listData.users.find(u => u.email === 'messi@gmail.com');
  const neymar = listData.users.find(u => u.email === 'neymarjr@gmail.com');

  if (messi) {
    await supabase.auth.admin.updateUserById(messi.id, { password: 'Messi@10' });
    console.log('Updated messi@gmail.com in Supabase Auth to Messi@10');
  }

  if (neymar) {
    await supabase.auth.admin.updateUserById(neymar.id, { password: 'Neymar@10' });
    console.log('Updated neymarjr@gmail.com in Supabase Auth to Neymar@10');
  }
}

main().catch(console.error);
