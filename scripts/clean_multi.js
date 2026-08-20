const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({ select: { id: true, images: true } });
    let fixed = 0;
    for (const p of products) {
        if (!p.images) continue;
        const parts = p.images.split(',').map(s => s.trim()).filter(Boolean);
        const hasRemote = parts.some(u => !u.startsWith('/uploads/'));
        if (hasRemote) {
            const cleanParts = parts.map(u => u.startsWith('/uploads/') ? u : '/uploads/products/test-sample.webp');
            await prisma.product.update({
                where: { id: p.id },
                data: { images: cleanParts.join(',') }
            });
            fixed++;
        }
    }
    console.log(`Cleaned ${fixed} multi-image products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
