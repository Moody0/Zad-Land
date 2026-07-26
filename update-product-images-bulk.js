const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sourceDir = 'E:\\work\\ruby-beauty\\ruby_beauty_images';
const destDir = path.join(__dirname, 'public', 'images', 'products');

async function main() {
    const products = await prisma.product.findMany({ select: { id: true, slug: true, name: true, images: true } });
    console.log(`Fetched ${products.length} products from DB.`);

    const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.webp'));
    console.log(`Found ${files.length} webp images in source folder.`);

    let notFoundCount = 0;
    const updates = [];

    for (const file of files) {
        const baseName = file.replace('.webp', '');
        const matches = products.filter(p => p.slug === baseName || p.slug.startsWith(baseName + '-'));
        
        if (matches.length > 0) {
            // Only copy if not already there to save time
            const destPath = path.join(destDir, file);
            if (!fs.existsSync(destPath)) {
                fs.copyFileSync(path.join(sourceDir, file), destPath);
            }

            const publicUrl = `/images/products/${file}`;
            for (const match of matches) {
                if (match.images !== publicUrl) {
                    updates.push(prisma.product.update({
                        where: { id: match.id },
                        data: { images: publicUrl }
                    }));
                }
            }
        } else {
            notFoundCount++;
        }
    }

    console.log(`Preparing to execute ${updates.length} DB updates in chunks...`);
    
    const chunkSize = 50;
    let completed = 0;
    for (let i = 0; i < updates.length; i += chunkSize) {
        const chunk = updates.slice(i, i + chunkSize);
        await Promise.all(chunk);
        completed += chunk.length;
        console.log(`Completed ${completed}/${updates.length}`);
    }

    console.log(`\nDone! Updated ${updates.length} products.`);
    console.log(`${notFoundCount} images had no matching product.`);
}

main()
    .catch(console.error)
    .finally(() => prisma['$disconnect']());
