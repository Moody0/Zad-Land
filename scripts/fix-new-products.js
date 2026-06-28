const xlsx = require('xlsx');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Reading Excel file...");
  const filePath = path.join(__dirname, '..', 'ruby beauty chinieses FINAL.xlsx');
  const workbook = xlsx.readFile(filePath);
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  
  // Map of lowercase product name to its Excel data
  const excelProducts = new Map();
  for (const row of data) {
    if (row.Name) {
      excelProducts.set(row.Name.trim().toLowerCase(), row);
    }
  }

  // Fetch all products that are currently (mistakenly) in Ruby Beauty
  console.log("Fetching stuck new products...");
  const products = await prisma.product.findMany({
    where: { brandId: 'brand-ruby-beauty' },
    include: { category: true }
  });

  const cache = { brands: {}, categories: {}, mainCategories: {} };
  let fixedCount = 0;

  for (const product of products) {
    const pName = product.name.trim().toLowerCase();
    
    // If it's IN the Excel file, it shouldn't be in Ruby Beauty!
    if (excelProducts.has(pName)) {
      const row = excelProducts.get(pName);
      const targetBrandName = row.Brand ? row.Brand.trim() : "Other";
      const targetMainCatName = row['Brand Group'] ? row['Brand Group'].trim() : targetBrandName.toUpperCase();
      
      // 1. Find or Create MainCategory
      if (!cache.mainCategories[targetMainCatName]) {
        let mainCat = await prisma.mainCategory.findFirst({ where: { name: targetMainCatName } });
        if (!mainCat) {
          mainCat = await prisma.mainCategory.create({
            data: {
              name: targetMainCatName,
              slug: targetMainCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 7)
            }
          });
        }
        cache.mainCategories[targetMainCatName] = mainCat.id;
      }
      const mainCatId = cache.mainCategories[targetMainCatName];

      // 2. Find or Create Brand
      if (!cache.brands[targetBrandName]) {
        let brand = await prisma.brand.findFirst({ where: { name: targetBrandName } });
        if (!brand) {
          brand = await prisma.brand.create({
            data: {
              name: targetBrandName,
              slug: targetBrandName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 7),
              mainCategoryId: mainCatId
            }
          });
        }
        cache.brands[targetBrandName] = brand.id;
      }
      const targetBrandId = cache.brands[targetBrandName];

      // 3. Find or Create Category
      const catCacheKey = `${targetBrandId}_${targetBrandName}`;
      if (!cache.categories[catCacheKey]) {
        let cat = await prisma.category.findFirst({ 
          where: { name: targetBrandName, brandId: targetBrandId } 
        });
        if (!cat) {
          cat = await prisma.category.create({
            data: {
              name: targetBrandName,
              slug: targetBrandName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 7),
              brandId: targetBrandId,
              mainCategoryId: mainCatId
            }
          });
        }
        cache.categories[catCacheKey] = cat.id;
      }
      const targetCatId = cache.categories[catCacheKey];

      // 4. Move the product
      await prisma.product.update({
        where: { id: product.id },
        data: {
          brandId: targetBrandId,
          categoryId: targetCatId,
          mainCategoryId: mainCatId
        }
      });
      
      console.log(`[-] Moved "${product.name}" out of Ruby Beauty to -> ${targetBrandName}`);
      fixedCount++;
    }
  }

  console.log(`\n✅ Done! Moved ${fixedCount} newly imported products to their correct brands & categories.`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
