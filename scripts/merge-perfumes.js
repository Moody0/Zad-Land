const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function mergeCategories() {
    const sourceSlug = 'perfums-tmp30';
    const targetSlug = 'perfumes';

    // check if it's a Category
    let sourceCat = await prisma.category.findUnique({ where: { slug: sourceSlug } });
    let targetCat = await prisma.category.findUnique({ where: { slug: targetSlug } });

    if (sourceCat && targetCat) {
        console.log(`Moving products from Category ${sourceSlug} to ${targetSlug}...`);
        await prisma.product.updateMany({
            where: { categoryId: sourceCat.id },
            data: { categoryId: targetCat.id }
        });
        await prisma.category.delete({ where: { id: sourceCat.id } });
        console.log('Category merged and source deleted.');
        return;
    }

    // check if it's a MainCategory
    let sourceMain = await prisma.mainCategory.findUnique({ where: { slug: sourceSlug } });
    let targetMain = await prisma.mainCategory.findUnique({ where: { slug: targetSlug } });

    if (sourceMain && targetMain) {
        console.log(`Moving products from MainCategory ${sourceSlug} to ${targetSlug}...`);
        await prisma.product.updateMany({
            where: { mainCategoryId: sourceMain.id },
            data: { mainCategoryId: targetMain.id }
        });
        // also check if any Categories are linked to the sourceMain
        await prisma.category.updateMany({
            where: { mainCategoryId: sourceMain.id },
            data: { mainCategoryId: targetMain.id }
        });
        await prisma.mainCategory.delete({ where: { id: sourceMain.id } });
        console.log('MainCategory merged and source deleted.');
        return;
    }

    console.log('Could not find source and target Categories or MainCategories matching the slugs.');
}

mergeCategories().catch(console.error).finally(() => prisma.$disconnect());
