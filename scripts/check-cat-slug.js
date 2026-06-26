const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
    const cats = await prisma.category.findMany({
        where: { name: { in: ['Accessories', 'Perfumes', 'Makeup', 'Electronics'] } }
    });
    console.log(cats.map(c => `${c.name}: ${c.slug}`));
}
check().finally(() => prisma.$disconnect());
