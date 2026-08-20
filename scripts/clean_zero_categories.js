const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanZeroCategories() {
    const deleted = await prisma.category.deleteMany({
        where: { products: { none: {} } }
    });
    console.log(`Deleted ${deleted.count} empty (0-product) subcategories.`);
}

cleanZeroCategories().catch(console.error).finally(() => prisma.$disconnect());
