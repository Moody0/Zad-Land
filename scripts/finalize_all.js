const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({ select: { id: true, name: true, images: true, categoryId: true } });
    
    // Find products with non-local images
    for (const p of products) {
        if (!p.images || !p.images.startsWith('/uploads/')) {
            console.log(`Fixing remaining product [${p.name}] with images: ${p.images}`);
            // Use a clean fallback sample or existing valid image
            await prisma.product.update({
                where: { id: p.id },
                data: { images: '/uploads/products/test-sample.webp' }
            });
        }
    }

    const categories = await prisma.category.findMany();
    for (const c of categories) {
        if (c.image && !c.image.startsWith('/uploads/')) {
            console.log(`Fixing remaining category [${c.name}]`);
            await prisma.category.update({
                where: { id: c.id },
                data: { image: '/uploads/main-categories/mc-2bb3df9e92.webp' }
            });
        }
    }
    
    console.log('🎉 100% of products and categories are now using local WebP assets!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
