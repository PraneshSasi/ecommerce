const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const messiHash = bcrypt.hashSync('Messi@10', 10);
  const neymarHash = bcrypt.hashSync('Neymar@10', 10);

  // Update Messi
  await prisma.user.update({
    where: { email: 'messi@gmail.com' },
    data: { password: messiHash }
  });
  console.log('Messi updated to Messi@10');

  // Update Neymar
  await prisma.user.update({
    where: { email: 'neymarjr@gmail.com' },
    data: { password: neymarHash }
  });
  console.log('Neymar updated to Neymar@10');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
