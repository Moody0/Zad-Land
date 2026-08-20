const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showStructure() {
    const mainCats = await prisma.mainCategory.findMany({
        include: {
            brands: { select: { name: true } },
            categories: { select: { name: true } },
            _count: { select: { products: true } }
        },
        orderBy: { name: 'asc' }
    });

    console.log("=== MAIN CATEGORIES ===");
    for (const mc of mainCats) {
        console.log(`- "${mc.name}" (${mc.description}) | Slug: ${mc.slug} | Products: ${mc._count.products} | Brands: [${mc.brands.map(b => b.name).join(', ')}]`);
    }

    const brands = await prisma.brand.findMany({
        include: {
            mainCategory: { select: { name: true } },
            categories: { select: { name: true, _count: { select: { products: true } } } },
            _count: { select: { products: true } }
        },
        orderBy: { name: 'asc' }
    });

    console.log("\n=== BRANDS & THEIR SUBCATEGORIES ===");
    for (const b of brands) {
        console.log(`\n🏢 Brand: "${b.name}" | Dept: "${b.mainCategory?.name}" | Total Products: ${b._count.products}`);
        for (const c of b.categories) {
            console.log(`   📁 "${c.name}" -> ${c._count.products} products`);
        }
    }
}

showStructure().catch(console.error).finally(() => prisma.$disconnect());
