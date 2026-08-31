const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const brands = await prisma.brand.findMany();
    console.log(`Found ${brands.length} existing brands in DB:`);
    brands.forEach(b => {
        console.log(`- ${b.name} (${b.slug}) | group: ${b.group} | image: ${b.image}`);
    });

    const mainCats = await prisma.mainCategory.findMany();
    console.log(`\nFound ${mainCats.length} existing MainCategories in DB:`);
    mainCats.forEach(m => {
        console.log(`- ${m.name} (${m.slug}) | image: ${m.image} | showInNav: ${m.showInNav}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
