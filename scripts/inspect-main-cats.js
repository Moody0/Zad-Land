const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspectMainCats() {
    const mainCats = await prisma.mainCategory.findMany({
        where: { isActive: true },
        include: {
            products: {
                where: { images: { not: '/placeholder.svg' }, price: { gt: 0 } },
                take: 1
            }
        }
    });

    console.log("=== MAIN CATEGORIES INSPECTION ===");
    for (const mc of mainCats) {
        console.log(`[${mc.slug}] name: "${mc.name}", desc: "${mc.description}", image: "${mc.image?.substring(0, 45)}...", validProducts: ${mc.products.length}`);
    }
}

inspectMainCats()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
