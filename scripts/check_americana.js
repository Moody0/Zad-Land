const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAmericana() {
    const prod = await prisma.product.findFirst({
        where: { brand: { name: { contains: "Americana" } }, category: { name: { contains: "حليب" } } },
        include: { category: true, brand: true, mainCategory: true }
    });
    if (prod) {
        console.log(`Americana Product: ID: ${prod.id} | Name: "${prod.name}" / "${prod.nameAr}" | Cat: "${prod.category?.name}"`);
    } else {
        console.log("No such product found");
    }
}

checkAmericana().catch(console.error).finally(() => prisma.$disconnect());
