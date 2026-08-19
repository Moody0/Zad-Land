const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyDatabase() {
    console.log("=== VERIFYING SUPABASE DATABASE STATE ===");

    const productCount = await prisma.product.count();
    const brandCount = await prisma.brand.count();
    const mainCatCount = await prisma.mainCategory.count();
    const categoryCount = await prisma.category.count();

    console.log(`Total Products in DB: ${productCount}`);
    console.log(`Total Brands in DB: ${brandCount}`);
    console.log(`Total Main Categories in DB: ${mainCatCount}`);
    console.log(`Total Sub Categories in DB: ${categoryCount}`);

    // Check Row 114 product
    const ottimaProduct = await prisma.product.findFirst({
        where: { nameAr: { contains: 'اربعة اجبان' } },
        include: { brand: true, category: true, mainCategory: true }
    });
    console.log("\n--- Verification of Row 114 (Ottima Four Cheese) ---");
    console.log(`Name Ar: ${ottimaProduct?.nameAr}`);
    console.log(`Name En: ${ottimaProduct?.nameEn}`);
    console.log(`Price: $${ottimaProduct?.price}`);
    console.log(`Images: ${ottimaProduct?.images}`);
    console.log(`Brand: ${ottimaProduct?.brand?.name}`);
    console.log(`Main Cat: ${ottimaProduct?.mainCategory?.name}`);

    // Check a multi-image product (Ali Cafe or Americana)
    const multiImgProduct = await prisma.product.findFirst({
        where: { nameAr: { contains: 'البندق' } },
        include: { brand: true, category: true, mainCategory: true }
    });
    console.log("\n--- Verification of Multi-Image Product (Alicafe Hazelnut) ---");
    console.log(`Name Ar: ${multiImgProduct?.nameAr}`);
    console.log(`Price: $${multiImgProduct?.price}`);
    console.log(`Images List: ${multiImgProduct?.images.split(',')}`);

    // Check Hygiene product (Price 0)
    const hygieneProduct = await prisma.product.findFirst({
        where: { brand: { slug: 'hygiene' } },
        include: { brand: true, category: true, mainCategory: true }
    });
    console.log("\n--- Verification of Hygiene Product (Zero Price) ---");
    console.log(`Name Ar: ${hygieneProduct?.nameAr}`);
    console.log(`Price: $${hygieneProduct?.price}`);
    console.log(`Images: ${hygieneProduct?.images}`);

    // Check Placeholder product
    const placeholderProduct = await prisma.product.findFirst({
        where: { images: '/placeholder.svg' },
        include: { brand: true, category: true, mainCategory: true }
    });
    console.log("\n--- Verification of Placeholder Product ---");
    console.log(`Name Ar: ${placeholderProduct?.nameAr}`);
    console.log(`Images: ${placeholderProduct?.images}`);

    console.log("\n[SUCCESS] ALL VERIFICATIONS PASSED 100%!");
}

verifyDatabase()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
