const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const mainCategories = await prisma.mainCategory.findMany({
            select: { name: true, slug: true, isActive: true }
        });
        console.log(JSON.stringify(mainCategories, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
