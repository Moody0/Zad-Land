const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
    const banners = await prisma.banner.findMany();
    const reviews = await prisma.review.findMany();
    const mainCats = await prisma.mainCategory.findMany({ include: { _count: { select: { products: true, categories: true } } } });
    const featuredCats = await prisma.category.findMany({ where: { isFeatured: true } });

    console.log("=== CURRENT DATABASE CONTENT ===");
    console.log(`Banners count: ${banners.length}`);
    console.log(`Reviews count: ${reviews.length}`);
    console.log(`Main Categories count: ${mainCats.length}`);
    console.log(`Featured Categories count: ${featuredCats.length}`);
}

checkDb()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
