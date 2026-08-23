const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const cats = await prisma.category.findMany({
        select: { id: true, name: true, image: true, brandId: true }
    });
    console.log(`Total categories: ${cats.length}`);
    const withImages = cats.filter(c => c.image && c.image !== '');
    console.log(`Categories with images: ${withImages.length}`);
    console.log(withImages.slice(0, 10));

    // Clear placeholder images from brand categories
    const cleared = await prisma.category.updateMany({
        where: {
            OR: [
                { image: { contains: 'unsplash' } },
                { image: { contains: 'mc-2bb3df9e92.webp' } },
                { image: { contains: 'placeholder' } }
            ]
        },
        data: {
            image: null
        }
    });
    console.log(`Cleared placeholder images from ${cleared.count} categories in DB`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
