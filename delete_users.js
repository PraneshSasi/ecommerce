const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const emailsToDelete = ['praneshsasi@gmail.com', 'leomessi@gmail.com'];
  
  for (const email of emailsToDelete) {
    try {
      await prisma.user.delete({
        where: { email }
      });
      console.log(`Successfully deleted user: ${email}`);
    } catch (e) {
      console.error(`Could not delete ${email}:`, e.meta?.cause || e.message);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
