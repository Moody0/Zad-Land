const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
    const cats = await prisma.category.findMany({
        where: { isFeatured: true },
        include: { products: { take: 1, select: { name: true, images: true, price: true } } }
    });

    console.log(`Found ${cats.length} featured categories:`);
    for (const c of cats) {
        console.log(`- ${c.name} (image: ${c.image?.substring(0, 40)}..., prod: ${c.products[0]?.name}, prodImg: ${c.products[0]?.images?.substring(0, 40)}...)`);
    }
}

checkCategories()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
