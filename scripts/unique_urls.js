const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({ select: { images: true } });
    const categories = await prisma.category.findMany({ select: { image: true } });
    const mainCategories = await prisma.mainCategory.findMany({ select: { image: true } });

    const remoteSet = new Set();
    for (const p of products) {
        if (!p.images) continue;
        p.images.split(',').map(s => s.trim()).forEach(u => {
            if (u && !u.startsWith('/uploads/') && !u.startsWith('/placeholder')) remoteSet.add(u);
        });
    }
    for (const c of categories) {
        if (c.image && !c.image.startsWith('/uploads/') && !c.image.startsWith('/placeholder')) remoteSet.add(c.image.trim());
    }
    for (const mc of mainCategories) {
        if (mc.image && !mc.image.startsWith('/uploads/') && !mc.image.startsWith('/placeholder')) remoteSet.add(mc.image.trim());
    }

    console.log('Total unique remote images to download:', remoteSet.size);
    console.log('Sample unique URLs:', Array.from(remoteSet).slice(0, 10));
}

main().catch(console.error).finally(() => prisma.$disconnect());
