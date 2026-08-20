const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const totalProducts = await prisma.product.count();
    const allProducts = await prisma.product.findMany({ select: { id: true, images: true } });

    let localProducts = 0;
    let remoteProducts = 0;
    let remoteUrlsSet = new Set();

    for (const p of allProducts) {
        if (!p.images) continue;
        const urls = p.images.split(',').map(s => s.trim()).filter(Boolean);
        const hasRemote = urls.some(u => !u.startsWith('/uploads/') && !u.startsWith('/placeholder'));
        if (hasRemote) {
            remoteProducts++;
            urls.forEach(u => {
                if (!u.startsWith('/uploads/') && !u.startsWith('/placeholder')) remoteUrlsSet.add(u);
            });
        } else {
            localProducts++;
        }
    }

    const files = fs.existsSync('public/uploads/products') 
        ? fs.readdirSync('public/uploads/products').filter(f => f.endsWith('.webp')).length 
        : 0;

    console.log(JSON.stringify({
        totalProducts,
        localProducts,
        remoteProductsRemaining: remoteProducts,
        uniqueRemoteUrlsRemaining: remoteUrlsSet.size,
        localWebpFilesOnDisk: files,
        percentageDone: ((localProducts / totalProducts) * 100).toFixed(1) + '%'
    }, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
