const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // 1. Find the PERFUMES main category
        const perfumesMainCat = await prisma.mainCategory.findFirst({
            where: { name: 'PERFUMES' }
        });

        if (!perfumesMainCat) {
            console.error("Could not find PERFUMES main category.");
            return;
        }

        // 2. Link the Brand "Perfums" to the main category
        await prisma.brand.updateMany({
            where: { name: 'Perfums' },
            data: { mainCategoryId: perfumesMainCat.id }
        });
        console.log("Linked Brand 'Perfums' to PERFUMES MainCategory.");

        // 3. Link the Category "Khaliji" to the main category
        await prisma.category.updateMany({
            where: { name: 'Khaliji' },
            data: { mainCategoryId: perfumesMainCat.id }
        });
        console.log("Linked Category 'Khaliji' to PERFUMES MainCategory.");

        // 4. Link all products that belong to the Khaliji category
        const updatedProducts = await prisma.product.updateMany({
            where: { 
                category: { name: 'Khaliji' } 
            },
            data: { mainCategoryId: perfumesMainCat.id }
        });
        console.log(`Linked ${updatedProducts.count} products in 'Khaliji' to PERFUMES MainCategory.`);

    } catch (error) {
        console.error("Error updating database:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
