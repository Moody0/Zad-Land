const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const p = await prisma.product.findFirst({
        where: { name: { contains: 'Velvet' } }
    });
    console.log('Hygiene Velvet Touch DB record:', p);

    const testSamples = await prisma.product.count({
        where: { images: { contains: 'test-sample.webp' } }
    });
    console.log('Remaining products with test-sample.webp:', testSamples);
}

main().catch(console.error).finally(() => prisma.$disconnect());
