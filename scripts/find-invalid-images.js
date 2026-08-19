const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findAndFixInvalidImages() {
    console.log("=== CHECKING PRODUCTS FOR INVALID IMAGES ===");
    const products = await prisma.product.findMany();
    let fixedCount = 0;

    for (const p of products) {
        const images = p.images;
        const isValid = images && (images.startsWith('http://') || images.startsWith('https://') || images.startsWith('/'));
        
        if (!isValid) {
            console.log(`[INVALID IMAGE FOUND] ID: ${p.id}, Name: "${p.name}", Images Value: "${images}"`);
            
            // Try to find if the image was stored in another field or set to placeholder
            await prisma.product.update({
                where: { id: p.id },
                data: { images: '/placeholder.svg' }
            });
            fixedCount++;
        }
    }

    console.log(`=== FINISHED: Checked ${products.length} products, fixed ${fixedCount} invalid image entries. ===`);
}

findAndFixInvalidImages()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
