const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    data: {
      password: '$2b$10$C3Q4F1DhNG27f2KXjvt4Ue6G0dkaofN10Sdj3FMfoX1JEF.zupxeq'
    }
  });
  console.log('All legacy passwords successfully updated to Messi@12345!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
