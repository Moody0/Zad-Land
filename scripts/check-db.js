const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const rb = await prisma.brand.findFirst({
    where: { name: { contains: 'Ruby Beauty' } }
  });
  console.log("Ruby Beauty Brand:", rb);

  const accCat = await prisma.category.findMany({
    where: { name: 'Accessories' },
    include: { brand: true }
  });
  console.log("Accessories Categories:", accCat);
}
main().finally(() => prisma.$disconnect());
