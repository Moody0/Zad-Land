const xlsx = require('xlsx');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
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

  const products = await prisma.product.findMany({
    where: { brandId: 'brand-ruby-beauty' },
    include: { category: true }
  });

  console.log(`Found ${products.length} products currently in Ruby Beauty brand.`);
  
  let stuckNewProducts = [];
  for (const product of products) {
    const pName = product.name.trim().toLowerCase();
    if (excelProducts.has(pName)) {
      stuckNewProducts.push({
        dbProduct: product,
        excelData: excelProducts.get(pName)
      });
    }
  }

  console.log(`Found ${stuckNewProducts.length} NEW products mistakenly assigned to Ruby Beauty!`);
  if (stuckNewProducts.length > 0) {
    console.log("Sample of stuck products:");
    for (let i = 0; i < Math.min(3, stuckNewProducts.length); i++) {
      console.log(`- DB Name: ${stuckNewProducts[i].dbProduct.name} | DB Category: ${stuckNewProducts[i].dbProduct.category.name} | Expected Brand (from Excel): ${stuckNewProducts[i].excelData.Brand}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
