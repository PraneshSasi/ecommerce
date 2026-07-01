const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'avatars' );
  `).catch(e => console.log('Policy 1 exists or error:', e.message));

  await prisma.$executeRawUnsafe(`
    CREATE POLICY "Auth Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'avatars' );
  `).catch(e => console.log('Policy 2 exists or error:', e.message));

  await prisma.$executeRawUnsafe(`
    CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'avatars' );
  `).catch(e => console.log('Policy 3 exists or error:', e.message));

  await prisma.$executeRawUnsafe(`
    CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'avatars' );
  `).catch(e => console.log('Policy 4 exists or error:', e.message));

  console.log('Finished setting up policies');
}

main().finally(() => prisma.$disconnect());
