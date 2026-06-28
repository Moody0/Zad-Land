const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Syncing products with their category's brand and mainCategory...");
    
    // Find all products and include their category
    const products = await prisma.product.findMany({
        include: {
            category: true
        }
    });

    let updatedCount = 0;

    for (const product of products) {
        if (!product.category) continue;

        const categoryBrandId = product.category.brandId;
        const categoryMainCategoryId = product.category.mainCategoryId;

        if (product.brandId !== categoryBrandId || product.mainCategoryId !== categoryMainCategoryId) {
            await prisma.product.update({
                where: { id: product.id },
                data: {
                    brandId: categoryBrandId,
                    mainCategoryId: categoryMainCategoryId
                }
            });
            updatedCount++;
            console.log(`Updated product "${product.name}" to match its category's brand/mainCategory.`);
        }
    }

    console.log(`\nSuccess! Updated ${updatedCount} products.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
