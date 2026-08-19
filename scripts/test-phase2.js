const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runPhase2Test() {
    console.log("=== Running Phase 2 Verification Suite ===");

    // 1. Ensure Brand and MainCategory exist
    let brand = await prisma.brand.findFirst({ where: { name: "دي سيكو ايطالي" } });
    if (!brand) {
        brand = await prisma.brand.create({
            data: {
                name: "دي سيكو ايطالي",
                slug: "de-cecco-italy",
                group: "MAIN",
                isActive: true,
                isFeatured: true
            }
        });
    }

    let mainCat = await prisma.mainCategory.findFirst({ where: { name: "معكرونة ومواد غذائية" } });
    if (!mainCat) {
        mainCat = await prisma.mainCategory.create({
            data: {
                name: "معكرونة ومواد غذائية",
                slug: "pasta-and-foodstuffs",
                isActive: true
            }
        });
    }

    let category = await prisma.category.findFirst({ where: { name: "سباغيتي وباستا", brandId: brand.id } });
    if (!category) {
        category = await prisma.category.create({
            data: {
                name: "سباغيتي وباستا",
                slug: "spaghetti-pasta",
                brandId: brand.id,
                mainCategoryId: mainCat.id
            }
        });
    }

    // 2. Test Single Product Insert with all 11 fields
    console.log("1. Testing Single Product Creation...");
    const sampleProduct = await prisma.product.create({
        data: {
            name: "De Cecco Spaghetti No. 12 500g",
            nameAr: "سباغيتي دي سيكو رقم 12 وزن 500 غرام",
            nameEn: "De Cecco Spaghetti No. 12 500g",
            slug: `de-cecco-spaghetti-12-${Date.now()}`,
            description: "Finest Italian durum wheat pasta",
            descriptionAr: "معكرونة إيطالية فاخرة من القمح القاسي عالي الجودة",
            descriptionEn: "Finest Italian durum wheat pasta, bronze die extruded",
            price: 2.75,
            stock: 120,
            options: "500g, 1kg",
            images: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=800",
            brandId: brand.id,
            categoryId: category.id,
            mainCategoryId: mainCat.id,
            sku: "DC-SPAG-012"
        }
    });
    console.log("-> Created Product ID:", sampleProduct.id);
    console.log("-> Product Name AR:", sampleProduct.nameAr);
    console.log("-> Product Name EN:", sampleProduct.nameEn);
    console.log("-> Product Options:", sampleProduct.options);

    // 3. Test Product Query with Relations
    console.log("2. Testing Product Query with Relations...");
    const fetched = await prisma.product.findUnique({
        where: { id: sampleProduct.id },
        include: { brand: true, category: true, mainCategory: true }
    });

    console.log("-> Fetched Brand:", fetched.brand?.name);
    console.log("-> Fetched Main Category:", fetched.mainCategory?.name);
    console.log("-> Fetched Sub Category:", fetched.category?.name);

    if (fetched.nameAr && fetched.options === "500g, 1kg" && fetched.mainCategory?.name === "معكرونة ومواد غذائية") {
        console.log("PASS: Phase 2 Data Structure Verification Successful!");
    } else {
        console.error("FAIL: Product fields mismatch");
        process.exit(1);
    }
}

runPhase2Test()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
