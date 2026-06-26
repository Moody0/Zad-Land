const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const cats = await prisma.category.findMany({
        where: { name: 'Perfums' }
    });
    console.log(cats);
}

check().catch(console.error).finally(() => prisma.$disconnect());
