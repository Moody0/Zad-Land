const xlsx = require('xlsx');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log("Reading Excel file...");
  const filePath = path.join(__dirname, '..', 'ruby beauty chinieses FINAL.xlsx');
  const workbook = xlsx.readFile(filePath);
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  
  // Create a normalized set of new product names
  const excelProductNames = new Set(data.map(r => r.Name.trim().toLowerCase()));
  console.log(`Found ${excelProductNames.size} new products in the Excel file.`);

  // Fetch all products
  console.log("Fetching products from database...");
  const products = await prisma.product.findMany({
    include: { category: true }
  });

  const rbCategories = {}; 
  let fixedCount = 0;

  console.log("Analyzing and fixing mixed products...");
  
  for (const product of products) {
    const pName = product.name.trim().toLowerCase();
    
    // If it's NOT in the Excel file, it is an original Ruby Beauty product
    if (!excelProductNames.has(pName)) {
      
      // If it is currently assigned to a brand OTHER than Ruby Beauty, it's mixed up!
      if (product.brandId !== 'brand-ruby-beauty') {
        const catName = product.category.name;
        
        // Find or create a Ruby Beauty category with this name
        if (!rbCategories[catName]) {
          let rbCat = await prisma.category.findFirst({
            where: { name: catName, brandId: 'brand-ruby-beauty' }
          });
          
          if (!rbCat) {
            rbCat = await prisma.category.create({
              data: {
                name: catName,
                slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 7),
                brandId: 'brand-ruby-beauty',
                mainCategoryId: null,
                isFeatured: false,
                description: `Products for ${catName}`
              }
            });
            console.log(`[+] Created new Ruby Beauty category: ${catName}`);
          }
          rbCategories[catName] = rbCat.id;
        }

        // Move the product
        await prisma.product.update({
          where: { id: product.id },
          data: {
            categoryId: rbCategories[catName],
            brandId: 'brand-ruby-beauty',
            mainCategoryId: null
          }
        });
        
        console.log(`[-] Moved "${product.name}" back to Ruby Beauty -> ${catName}`);
        fixedCount++;
      }
    }
  }
  
  console.log(`\n✅ Done! Successfully untangled and moved ${fixedCount} original Ruby Beauty products.`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
