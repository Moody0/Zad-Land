const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixBrands() {
    const requiredBrands = [
        { slug: 'accessories', name: 'Accessories', group: 'MAIN' },
        { slug: 'perfumes', name: 'Perfumes', group: 'MAIN' },
        { slug: 'makeup', name: 'Makeup', group: 'MAIN' },
        { slug: 'watches', name: 'Watches', group: 'MAIN' }
    ];

    for (const b of requiredBrands) {
        await prisma.brand.upsert({
            where: { slug: b.slug },
            update: { group: b.group, isActive: true },
            create: {
                name: b.name,
                slug: b.slug,
                group: b.group,
                isActive: true,
                isFeatured: true
            }
        });
        console.log(`Ensured brand: ${b.slug}`);
    }
}

fixBrands().finally(() => prisma.$disconnect());
