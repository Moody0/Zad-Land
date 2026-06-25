const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
    await prisma.mainCategory.updateMany({ where: { name: 'PERFUMES' }, data: { slug: 'perfumes' } });
    await prisma.mainCategory.updateMany({ where: { name: 'ACCESSORIES' }, data: { slug: 'accessories' } });
    await prisma.mainCategory.updateMany({ where: { name: 'MAKEUP' }, data: { slug: 'makeup' } });
    await prisma.mainCategory.updateMany({ where: { name: 'ELECTRONICS' }, data: { slug: 'electronics' } });
    await prisma.mainCategory.updateMany({ where: { name: 'SKINCARE' }, data: { slug: 'skincare' } });
    await prisma.mainCategory.updateMany({ where: { name: 'NAILS' }, data: { slug: 'nails' } });
    await prisma.mainCategory.updateMany({ where: { name: 'TEETH CARE' }, data: { slug: 'teeth-care' } });
    await prisma.mainCategory.updateMany({ where: { name: 'BODY AND HAIR CARE' }, data: { slug: 'body-and-hair-care' } });
    console.log('Slugs fixed');
}

fix().finally(() => prisma.$disconnect());
