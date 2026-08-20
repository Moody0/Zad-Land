const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function auditData() {
    console.log("=== 1. AUDITING MAIN CATEGORIES (DEPARTMENTS) ===");
    const mainCats = await prisma.mainCategory.findMany({
        include: {
            _count: { select: { products: true, categories: true, brands: true } }
        },
        orderBy: { name: 'asc' }
    });
    console.log(`Total Main Categories: ${mainCats.length}`);
    for (const mc of mainCats) {
        console.log(`[MainCategory] ID: ${mc.id} | Name: "${mc.name}" | En: "${mc.description}" | Slug: "${mc.slug}" | Products: ${mc._count.products} | Subcats: ${mc._count.categories} | Brands: ${mc._count.brands}`);
    }

    console.log("\n=== 2. AUDITING BRANDS ===");
    const brands = await prisma.brand.findMany({
        include: {
            mainCategory: { select: { name: true } },
            _count: { select: { products: true, categories: true } }
        },
        orderBy: { name: 'asc' }
    });
    console.log(`Total Brands: ${brands.length}`);
    for (const b of brands) {
        console.log(`[Brand] ID: ${b.id} | Name: "${b.name}" | Slug: "${b.slug}" | Dept: "${b.mainCategory?.name || 'NONE'}" | Products: ${b._count.products} | Subcats: ${b._count.categories}`);
    }

    console.log("\n=== 3. AUDITING SUBCATEGORIES (CATEGORIES) ===");
    const categories = await prisma.category.findMany({
        include: {
            brand: { select: { name: true } },
            mainCategory: { select: { name: true } },
            _count: { select: { products: true } }
        },
        orderBy: [{ brand: { name: 'asc' } }, { name: 'asc' }]
    });
    console.log(`Total Subcategories: ${categories.length}`);

    const zeroProductCats = categories.filter(c => c._count.products === 0);
    console.log(`\n-- Subcategories with 0 Products (${zeroProductCats.length}):`);
    for (const c of zeroProductCats) {
        console.log(`  - ID: ${c.id} | Name: "${c.name}" | Brand: "${c.brand?.name}" | Dept: "${c.mainCategory?.name || 'NONE'}"`);
    }

    console.log(`\n-- All Subcategories with Product Counts:`);
    for (const c of categories) {
        console.log(`  - ID: ${c.id} | Name: "${c.name}" | En: "${c.description || ''}" | Brand: "${c.brand?.name}" | Dept: "${c.mainCategory?.name || 'NONE'}" | Products: ${c._count.products}`);
    }
}

auditData().catch(console.error).finally(() => prisma.$disconnect());
