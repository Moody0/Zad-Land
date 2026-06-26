const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
    const cats = await prisma.category.findMany({ include: { mainCategory: true } });
    console.log(cats.map(c => ({ name: c.name, mainCat: c.mainCategory?.name })));
}
check().finally(() => prisma.$disconnect());
