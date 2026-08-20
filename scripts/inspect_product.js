const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const p = await prisma.product.findFirst({
        where: { name: { contains: 'Pepperoni' } },
        include: { brand: true, category: true }
    });
    console.log(JSON.stringify(p, null, 2));

    const sampleProducts = await prisma.product.findMany({
        where: { images: { contains: 'test-sample.webp' } },
        select: { id: true, name: true, images: true }
    });
    console.log('\nProducts pointing to test-sample.webp:', sampleProducts.length);
    console.log(sampleProducts.map(s => s.name));
}

main().catch(console.error).finally(() => prisma.$disconnect());
