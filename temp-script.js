const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ take: 5 });
  console.log(products.map(p => ({ slug: p.slug, images: p.images })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
