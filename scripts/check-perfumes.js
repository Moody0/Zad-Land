const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const cats = await prisma.category.findMany({
        where: { mainCategory: { name: 'PERFUMES' } }
    });
    console.log(cats.map(c => ({ name: c.name, slug: c.slug })));
}

check().catch(console.error).finally(() => prisma.$disconnect());
