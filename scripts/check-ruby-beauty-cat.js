const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const cat = await prisma.category.findFirst({
    where: { brandId: 'brand-ruby-beauty' }
  });
  console.log(cat);
}
main().finally(() => prisma.$disconnect());
