const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const pCount = await prisma.product.count();
    const cCount = await prisma.category.count();
    const mCount = await prisma.mainCategory.count();
    console.log({ products: pCount, categories: cCount, mainCategories: mCount });

    const cats = await prisma.category.findMany({ select: { id: true, name: true, image: true } });
    const catHosts = {};
    for (const c of cats) {
        if (!c.image) continue;
        if (c.image.startsWith('/')) {
            catHosts['/local'] = (catHosts['/local'] || 0) + 1;
        } else {
            try {
                const h = new URL(c.image).hostname;
                catHosts[h] = (catHosts[h] || 0) + 1;
            } catch (e) {
                catHosts['invalid'] = (catHosts['invalid'] || 0) + 1;
            }
        }
    }
    console.log('Category Image Hosts:', catHosts);

    const brands = await prisma.brand.findMany({ select: { id: true, name: true, image: true } });
    console.log('Brands:', brands.length, brands.map(b => b.image).filter(Boolean).slice(0, 5));

    const banners = await prisma.banner.findMany({ select: { id: true, image: true } });
    console.log('Banners:', banners.length, banners.map(b => b.image).filter(Boolean));
}

main().catch(console.error).finally(() => prisma.$disconnect());
