const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function fix() {
    const targets = ['Accessories', 'Perfumes', 'Makeup', 'Electronics', 'Skincare', 'Nails', 'Eyes', 'Lips', 'Haircare', 'BodyCare'];
    for (const name of targets) {
        const cat = await prisma.category.findFirst({ where: { name } });
        if (cat) {
            const desiredSlug = name.toLowerCase().replace(/\s+/g, '-');
            // make sure it's unique
            const existing = await prisma.category.findUnique({ where: { slug: desiredSlug } });
            if (!existing || existing.id === cat.id) {
                await prisma.category.update({ where: { id: cat.id }, data: { slug: desiredSlug } });
                console.log(`Updated ${name} to ${desiredSlug}`);
            } else {
                console.log(`Could not update ${name}, ${desiredSlug} already exists`);
            }
        }
    }
}
fix().finally(() => prisma.$disconnect());
