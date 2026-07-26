const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sourceDir = 'E:\\work\\ruby-beauty\\ruby_beauty_images';
const destDir = path.join(__dirname, 'public', 'images', 'products');

async function main() {
    // 1. Fetch all products
    const products = await prisma.product.findMany({ select: { id: true, slug: true, name: true, images: true } });
    console.log(`Fetched ${products.length} products from DB.`);

    // 2. Read images
    const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.webp'));
    console.log(`Found ${files.length} webp images in source folder.`);

    let updatedCount = 0;
    let notFoundCount = 0;

    for (const file of files) {
        const baseName = file.replace('.webp', '');
        
        // Find matching product(s)
        const matches = products.filter(p => p.slug === baseName || p.slug.startsWith(baseName + '-'));
        
        if (matches.length > 0) {
            // Copy file
            const srcPath = path.join(sourceDir, file);
            const destPath = path.join(destDir, file);
            fs.copyFileSync(srcPath, destPath);

            // Update product in DB
            const publicUrl = `/images/products/${file}`;
            for (const match of matches) {
                if (match.images !== publicUrl) {
                    await prisma.product.update({
                        where: { id: match.id },
                        data: { images: publicUrl }
                    });
                    updatedCount++;
                }
            }
        } else {
            console.log(`No product match found for image: ${file}`);
            notFoundCount++;
        }
    }

    console.log(`\nDone! Updated ${updatedCount} products.`);
    console.log(`${notFoundCount} images had no matching product.`);
}

main()
    .catch(console.error)
    .finally(() => {
        // use bracket notation to avoid $ stripping issues just in case
        prisma['$disconnect']();
    });
