const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const slugify = require('slugify');

const prisma = new PrismaClient();

async function importData() {
    try {
        const filePath = 'C:/Users/moham/OneDrive/Desktop/Web/ruby-beauty/ruby beauty chinieses FINAL.xlsx';
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        console.log(`Starting import of ${data.length} items...`);

        // 1. Clean existing data
        console.log('Cleaning existing data...');
        await prisma.orderItem.deleteMany({});
        await prisma.product.deleteMany({});
        await prisma.category.deleteMany({});
        await prisma.mainCategory.deleteMany({});
        console.log('Database cleaned.');

        const rubyBrand = await prisma.brand.upsert({
            where: { slug: 'ruby-beauty' },
            update: {
                group: 'MAIN',
                isActive: true,
                isFeatured: true,
            },
            create: {
                id: 'brand-ruby-beauty',
                name: 'Ruby Beauty',
                slug: 'ruby-beauty',
                group: 'MAIN',
                isActive: true,
                isFeatured: true,
            },
        });

        // 2. Extract and create Main Categories (from "Brand Group")
        console.log('Processing Main Categories and Categories...');
        const mainCategoryMap = new Map();
        const categoryMap = new Map(); // Key: "MainCategoryName||CategoryName"

        const uniqueMainCategoryNames = [...new Set(data.map(item => item['Brand Group']).filter(Boolean))];
        
        for (const mainCatName of uniqueMainCategoryNames) {
            try {
                const baseSlug = slugify(String(mainCatName), { lower: true, strict: true }) || 'main-category';
                const mainCategory = await prisma.mainCategory.create({
                    data: {
                        name: String(mainCatName),
                        slug: `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`,
                        description: `${mainCatName} collection`,
                        isActive: true,
                        isFeatured: false,
                    }
                });
                mainCategoryMap.set(String(mainCatName), mainCategory.id);
            } catch (err) {
                console.error(`Error creating main category ${mainCatName}:`, err.message);
            }
        }

        // 3. Extract and create Categories (Sub categories from "Brand")
        for (const item of data) {
            const mainCatName = item['Brand Group'];
            const catName = item['Brand'];
            
            if (!mainCatName || !catName) continue;

            const mapKey = `${mainCatName}||${catName}`;
            if (!categoryMap.has(mapKey)) {
                try {
                    const mainCategoryId = mainCategoryMap.get(String(mainCatName));
                    const baseSlug = slugify(String(catName), { lower: true, strict: true }) || 'category';
                    
                    // We need to handle @@unique([brandId, name])
                    // If the same catName appears in a different MainCategory, we suffix it.
                    // But typically they are unique. Let's just create it.
                    const existingCategory = await prisma.category.findFirst({
                        where: {
                            brandId: rubyBrand.id,
                            name: String(catName)
                        }
                    });

                    let category;
                    if (existingCategory) {
                        category = existingCategory;
                    } else {
                        category = await prisma.category.create({
                            data: {
                                name: String(catName),
                                slug: `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`,
                                description: `Products for ${catName}`,
                                brandId: rubyBrand.id,
                                mainCategoryId: mainCategoryId,
                            },
                        });
                    }
                    categoryMap.set(mapKey, category.id);
                } catch (err) {
                    console.error(`Error creating category ${catName}:`, err.message);
                }
            }
        }

        // 4. Import products
        console.log('Importing products...');
        let importedCount = 0;
        let errorCount = 0;

        for (const item of data) {
            if (!item.Name) {
                console.warn(`Skipping item with missing Name: ${JSON.stringify(item)}`);
                errorCount++;
                continue;
            }

            const mainCatName = item['Brand Group'];
            const catName = item['Brand'];
            const mapKey = `${mainCatName}||${catName}`;
            
            const categoryId = categoryMap.get(mapKey);
            const mainCategoryId = mainCategoryMap.get(String(mainCatName));

            if (!categoryId || !mainCategoryId) {
                console.warn(`Skipping item due to missing category mapping: ${item.Name}`);
                errorCount++;
                continue;
            }

            try {
                const baseSlug = slugify(String(item.Name), { lower: true, strict: true }) || 'product';
                const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

                await prisma.product.create({
                    data: {
                        name: String(item.Name),
                        sku: item.SKU ? String(item.SKU) : null,
                        slug: slug,
                        price: 0, // Enforcing 0 price as requested
                        stock: parseInt(item.Stock) || 0,
                        isTrending: String(item['Is Trending']).toUpperCase() === 'YES',
                        images: item.Images || '',
                        brandId: rubyBrand.id,
                        categoryId: categoryId,
                        mainCategoryId: mainCategoryId,
                        description: item.Description ? String(item.Description) : `Quality product from ${catName}`
                    }
                });
                importedCount++;
                if (importedCount % 100 === 0) console.log(`Imported ${importedCount} products...`);
            } catch (err) {
                console.error(`Error importing product ${item.Name}:`, err.message);
                errorCount++;
            }
        }

        console.log('--- IMPORT SUMMARY ---');
        console.log(`Successfully imported: ${importedCount}`);
        console.log(`Failed: ${errorCount}`);
        console.log(`Total Main Categories: ${uniqueMainCategoryNames.length}`);
        console.log(`Total Sub Categories: ${categoryMap.size}`);

    } catch (error) {
        console.error('Fatal Import Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

importData();
