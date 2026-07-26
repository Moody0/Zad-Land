const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');
const slugify = require('slugify');

const prisma = new PrismaClient();

const filePath = "C:\\Users\\moham\\Downloads\\عطور روبي بيوتي.xlsx";

async function main() {
    try {
        console.log('Reading Excel file...');
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Read as JSON with objects using the first row as headers
        const data = xlsx.utils.sheet_to_json(sheet);
        
        console.log(`Found ${data.length} rows.`);

        let newBrandsCount = 0;
        let newCategoriesCount = 0;
        let newProductsCount = 0;

        for (const row of data) {
            const brandName = row['Brand'] ? row['Brand'].toString().trim() : null;
            const categoryName = row['Category'] ? row['Category'].toString().trim() : null;
            const productName = row['Name'] ? row['Name'].toString().trim() : null;
            
            if (!productName || !brandName || !categoryName) {
                console.log('Skipping row due to missing Name, Brand, or Category:', row);
                continue;
            }

            // 1. Ensure Brand
            let brand = await prisma.brand.findUnique({
                where: { name: brandName }
            });
            
            if (!brand) {
                const brandSlug = slugify(brandName, { lower: true, strict: true });
                let uniqueBrandSlug = brandSlug;
                let counter = 1;
                while(await prisma.brand.findUnique({ where: { slug: uniqueBrandSlug } })) {
                    uniqueBrandSlug = `${brandSlug}-${counter}`;
                    counter++;
                }
                
                brand = await prisma.brand.create({
                    data: {
                        name: brandName,
                        slug: uniqueBrandSlug,
                        group: 'DIFFERENT'
                    }
                });
                console.log(`Created Brand: ${brandName}`);
                newBrandsCount++;
            }

            // 2. Ensure Category
            const catSlugBase = slugify(categoryName, { lower: true, strict: true });
            let category = await prisma.category.findFirst({
                where: { 
                    name: categoryName,
                    brandId: brand.id
                }
            });

            if (!category) {
                let uniqueCatSlug = catSlugBase;
                let counter = 1;
                while(await prisma.category.findUnique({ where: { slug: uniqueCatSlug } })) {
                    uniqueCatSlug = `${catSlugBase}-${counter}`;
                    counter++;
                }

                category = await prisma.category.create({
                    data: {
                        name: categoryName,
                        slug: uniqueCatSlug,
                        brandId: brand.id
                    }
                });
                console.log(`Created Category: ${categoryName} under Brand: ${brandName}`);
                newCategoriesCount++;
            }

            // 3. Create Product
            const productSlugBase = slugify(productName, { lower: true, strict: true });
            let uniqueProdSlug = productSlugBase;
            let counter = 1;
            while(await prisma.product.findUnique({ where: { slug: uniqueProdSlug } })) {
                uniqueProdSlug = `${productSlugBase}-${counter}`;
                counter++;
            }
            
            const price = parseFloat(row['Price']) || 0;
            const discount = parseFloat(row['Discount']) || 0;
            
            let finalDiscountPrice = null;
            let discountType = null;
            let discountValue = null;
            
            if (discount > 0) {
                if (discount <= 100) {
                    // Assuming percentage if <= 100
                    discountType = 'PERCENTAGE';
                    discountValue = discount;
                    finalDiscountPrice = price * (1 - discount/100);
                } else {
                    // Assuming fixed amount if > 100
                    discountType = 'FIXED';
                    discountValue = discount;
                    finalDiscountPrice = price - discount;
                }
            }

            const imagesStr = row['Images'] ? row['Images'].toString().trim() : '';
            const stock = parseInt(row['Stock']) || 0;
            const isTrending = row['Is Trending'] && row['Is Trending'].toString().trim().toUpperCase() === 'YES';
            const description = row['Description'] ? row['Description'].toString().trim() : '';
            const sku = row['SKU'] ? row['SKU'].toString().trim() : null;

            await prisma.product.create({
                data: {
                    name: productName,
                    slug: uniqueProdSlug,
                    description: description,
                    price: price,
                    discountPrice: finalDiscountPrice,
                    discountType: discountType,
                    discountValue: discountValue,
                    stock: stock,
                    images: imagesStr,
                    isTrending: isTrending,
                    sku: sku,
                    brandId: brand.id,
                    categoryId: category.id,
                }
            });
            console.log(`Imported Product: ${productName}`);
            newProductsCount++;
        }
        console.log(`\nImport complete! Added ${newBrandsCount} brands, ${newCategoriesCount} categories, and ${newProductsCount} products.`);
    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
