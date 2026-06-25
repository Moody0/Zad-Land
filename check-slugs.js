const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const brands = await prisma.brand.findMany({ select: { slug: true, name: true } });
  const mainCategories = await prisma.mainCategory.findMany({ select: { slug: true, name: true } });
  console.log('Brands:', brands);
  console.log('MainCategories:', mainCategories);
}

main().finally(() => prisma.$disconnect());
