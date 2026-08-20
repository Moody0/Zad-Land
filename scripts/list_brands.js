const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const brands = await prisma.brand.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true, image: true, description: true }
    });
    console.log(JSON.stringify(brands, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
