const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 STARTING CATALOG CONSOLIDATION & CLEANUP...\n");

    // =========================================================================
    // STEP 1: FIX MISASSIGNED PRODUCTS & DUPLICATE BRANDS
    // =========================================================================
    console.log("--- Step 1: Fixing misassigned products & duplicate brands ---");
    
    // 1.1 Move "حليب صويا بالفيتامين 1 ليتر" to Lovege brand
    const lovegeBrand = await prisma.brand.findFirst({ where: { name: { contains: "Lovege" } } });
    const lovegeCat = await prisma.category.findFirst({ where: { brandId: lovegeBrand?.id } });
    const soyMilk = await prisma.product.findFirst({
        where: { name: { contains: "Soy Milk" } }
    });
    if (soyMilk && lovegeBrand && lovegeCat) {
        await prisma.product.update({
            where: { id: soyMilk.id },
            data: {
                brandId: lovegeBrand.id,
                categoryId: lovegeCat.id
            }
        });
        console.log("✅ Moved Soy Milk to brand 'Lovege - لوفيج'");
    }

    // 1.2 Delete duplicate brand "De Cecco Italy" (with 0 products)
    const deadBrand = await prisma.brand.findFirst({
        where: { name: "De Cecco Italy" },
        include: { _count: { select: { products: true, categories: true } } }
    });
    if (deadBrand && deadBrand._count.products === 0) {
        await prisma.category.deleteMany({ where: { brandId: deadBrand.id } });
        await prisma.brand.delete({ where: { id: deadBrand.id } });
        console.log("✅ Deleted duplicate brand 'De Cecco Italy' (0 products)");
    }

    // =========================================================================
    // STEP 2: CONSOLIDATE NABIL SUBCATEGORIES (11 -> 5)
    // =========================================================================
    console.log("\n--- Step 2: Consolidating Nabil Subcategories ---");
    const nabil = await prisma.brand.findFirst({ where: { name: { contains: "Nabil" } } });
    if (nabil) {
        // Target 1: دجاج ومقليات
        let nabilPoultry = await prisma.category.findFirst({
            where: { brandId: nabil.id, name: { in: ["دجاج ومقليات", "ستريبس وناغتس دجاج", "ستريبس وفيليه دجاج", "دجاج وبانيه مقلي مجمد"] } }
        });
        if (nabilPoultry) {
            nabilPoultry = await prisma.category.update({
                where: { id: nabilPoultry.id },
                data: { name: "دجاج ومقليات", description: "Poultry & Strips", slug: "nabil-poultry-strips", isFeatured: true }
            });
            await prisma.product.updateMany({
                where: {
                    brandId: nabil.id,
                    category: { name: { in: ["ستريبس وناغتس دجاج", "ستريبس وفيليه دجاج", "دجاج وبانيه مقلي مجمد", "دجاج متبل ومجهز"] } }
                },
                data: { categoryId: nabilPoultry.id }
            });
            console.log("  ✅ Nabil -> 'دجاج ومقليات'");
        }

        // Target 2: برغر ولحوم
        let nabilBurgers = await prisma.category.findFirst({
            where: { brandId: nabil.id, name: { in: ["برغر ولحوم", "برغر بقري مجمد", "لحوم باردة ومصنعة"] } }
        });
        if (nabilBurgers) {
            nabilBurgers = await prisma.category.update({
                where: { id: nabilBurgers.id },
                data: { name: "برغر ولحوم", description: "Burgers & Meats", slug: "nabil-burgers-meats", isFeatured: true }
            });
            await prisma.product.updateMany({
                where: {
                    brandId: nabil.id,
                    category: { name: { in: ["برغر بقري مجمد", "لحوم باردة ومصنعة"] } }
                },
                data: { categoryId: nabilBurgers.id }
            });
            console.log("  ✅ Nabil -> 'برغر ولحوم'");
        }

        // Target 3: معجنات ومقبلات
        let nabilPastries = await prisma.category.findFirst({
            where: { brandId: nabil.id, name: { in: ["معجنات ومقبلات", "سمبوسك ومعجنات مجمدة", "مقبلات وكبة مجمدة"] } }
        });
        if (nabilPastries) {
            nabilPastries = await prisma.category.update({
                where: { id: nabilPastries.id },
                data: { name: "معجنات ومقبلات", description: "Pastries & Appetizers", slug: "nabil-pastries-appetizers", isFeatured: true }
            });
            await prisma.product.updateMany({
                where: {
                    brandId: nabil.id,
                    category: { name: { in: ["سمبوسك ومعجنات مجمدة", "مقبلات وكبة مجمدة"] } }
                },
                data: { categoryId: nabilPastries.id }
            });
            console.log("  ✅ Nabil -> 'معجنات ومقبلات'");
        }

        // Target 4: وجبات جاهزة
        let nabilMeals = await prisma.category.findFirst({
            where: { brandId: nabil.id, name: { in: ["وجبات جاهزة", "وجبات ولحوم جاهزة للطهي", "وجبات مجهزة ومكرونة مجمدة"] } }
        });
        if (nabilMeals) {
            nabilMeals = await prisma.category.update({
                where: { id: nabilMeals.id },
                data: { name: "وجبات جاهزة", description: "Ready Meals", slug: "nabil-ready-meals", isFeatured: false }
            });
            await prisma.product.updateMany({
                where: {
                    brandId: nabil.id,
                    category: { name: { in: ["وجبات ولحوم جاهزة للطهي", "وجبات مجهزة ومكرونة مجمدة"] } }
                },
                data: { categoryId: nabilMeals.id }
            });
            console.log("  ✅ Nabil -> 'وجبات جاهزة'");
        }

        // Target 5: خضار مجمد
        const nabilVeg = await prisma.category.findFirst({
            where: { brandId: nabil.id, name: "خضار مجمد" }
        });
        if (nabilVeg) {
            await prisma.category.update({
                where: { id: nabilVeg.id },
                data: { name: "خضار مجمد", description: "Frozen Vegetables", slug: "nabil-frozen-vegetables", isFeatured: false }
            });
            console.log("  ✅ Nabil -> 'خضار مجمد'");
        }

        // Delete empty Nabil subcategories
        await prisma.category.deleteMany({
            where: {
                brandId: nabil.id,
                products: { none: {} }
            }
        });
    }

    // =========================================================================
    // STEP 3: CONSOLIDATE CAPTAIN FISHER SUBCATEGORIES (8 -> 5)
    // =========================================================================
    console.log("\n--- Step 3: Consolidating Captain Fisher Subcategories ---");
    const captainFisher = await prisma.brand.findFirst({ where: { name: { contains: "Captain Fisher" } } });
    if (captainFisher) {
        // Target 1: جمبري وروبيان
        let cfShrimp = await prisma.category.findFirst({
            where: { brandId: captainFisher.id, name: { in: ["جمبري وروبيان", "روبيان وجمبري مجمد"] } }
        });
        if (cfShrimp) {
            cfShrimp = await prisma.category.update({
                where: { id: cfShrimp.id },
                data: { name: "جمبري وروبيان", description: "Shrimp & Prawns", slug: "cf-shrimp-prawns", isFeatured: true }
            });
            await prisma.product.updateMany({
                where: { brandId: captainFisher.id, category: { name: "روبيان وجمبري مجمد" } },
                data: { categoryId: cfShrimp.id }
            });
            console.log("  ✅ Captain Fisher -> 'جمبري وروبيان'");
        }

        // Target 2: أسماك وفيليه
        let cfFish = await prisma.category.findFirst({
            where: { brandId: captainFisher.id, name: { in: ["أسماك وفيليه", "فيليه سمك مجمد", "أسماك مجمدة كاملة"] } }
        });
        if (cfFish) {
            cfFish = await prisma.category.update({
                where: { id: cfFish.id },
                data: { name: "أسماك وفيليه", description: "Fish & Fillets", slug: "cf-fish-fillets", isFeatured: true }
            });
            await prisma.product.updateMany({
                where: { brandId: captainFisher.id, category: { name: { in: ["فيليه سمك مجمد", "أسماك مجمدة كاملة"] } } },
                data: { categoryId: cfFish.id }
            });
            console.log("  ✅ Captain Fisher -> 'أسماك وفيليه'");
        }

        // Target 3: كاليماري وقشريات
        let cfCalamari = await prisma.category.findFirst({
            where: { brandId: captainFisher.id, name: { in: ["كاليماري وقشريات", "حبار وكاليماري مجمد", "سلطعون وقشريات مجمدة", "رخويات ومأكولات بحرية"] } }
        });
        if (cfCalamari) {
            cfCalamari = await prisma.category.update({
                where: { id: cfCalamari.id },
                data: { name: "كاليماري وقشريات", description: "Calamari & Shellfish", slug: "cf-calamari-shellfish", isFeatured: true }
            });
            await prisma.product.updateMany({
                where: { brandId: captainFisher.id, category: { name: { in: ["حبار وكاليماري مجمد", "سلطعون وقشريات مجمدة", "رخويات ومأكولات بحرية"] } } },
                data: { categoryId: cfCalamari.id }
            });
            console.log("  ✅ Captain Fisher -> 'كاليماري وقشريات'");
        }

        // Target 4: مأكولات بحرية مجهزة
        let cfPrepared = await prisma.category.findFirst({
            where: { brandId: captainFisher.id, name: { in: ["مأكولات بحرية مجهزة", "مأكولات بحرية مجهزة ومقلية"] } }
        });
        if (cfPrepared) {
            cfPrepared = await prisma.category.update({
                where: { id: cfPrepared.id },
                data: { name: "مأكولات بحرية مجهزة", description: "Prepared Seafood", slug: "cf-prepared-seafood", isFeatured: true }
            });
            await prisma.product.updateMany({
                where: { brandId: captainFisher.id, category: { name: "مأكولات بحرية مجهزة ومقلية" } },
                data: { categoryId: cfPrepared.id }
            });
            console.log("  ✅ Captain Fisher -> 'مأكولات بحرية مجهزة'");
        }

        // Target 5: مقبلات وأجبان
        let cfAppetizers = await prisma.category.findFirst({
            where: { brandId: captainFisher.id, name: { in: ["مقبلات وأجبان", "مقبلات وأجبان مجمدة"] } }
        });
        if (cfAppetizers) {
            await prisma.category.update({
                where: { id: cfAppetizers.id },
                data: { name: "مقبلات وأجبان", description: "Appetizers & Cheese", slug: "cf-appetizers-cheese", isFeatured: false }
            });
            console.log("  ✅ Captain Fisher -> 'مقبلات وأجبان'");
        }

        // Delete empty Captain Fisher subcategories
        await prisma.category.deleteMany({
            where: {
                brandId: captainFisher.id,
                products: { none: {} }
            }
        });
    }

    // =========================================================================
    // STEP 4: CONSOLIDATE SANTE SUBCATEGORIES (9 -> 4)
    // =========================================================================
    console.log("\n--- Step 4: Consolidating Sante Subcategories ---");
    const sante = await prisma.brand.findFirst({ where: { name: { contains: "Sante" } } });
    if (sante) {
        // Target 1: جرانولا وموسلي
        let santeGranola = await prisma.category.findFirst({
            where: { brandId: sante.id, name: { in: ["جرانولا وموسلي", "جرانولا وحبوب إفطار", "موسلي وحبوب إفطار", "كرانشي وحبوب إفطار", "حبوب الإفطار والشوفان"] } }
        });
        if (santeGranola) {
            santeGranola = await prisma.category.update({
                where: { id: santeGranola.id },
                data: { name: "جرانولا وموسلي", description: "Granola & Muesli", slug: "sante-granola-muesli", isFeatured: true }
            });
            await prisma.product.updateMany({
                where: { brandId: sante.id, category: { name: { in: ["جرانولا وحبوب إفطار", "موسلي وحبوب إفطار", "كرانشي وحبوب إفطار", "حبوب الإفطار والشوفان"] } } },
                data: { categoryId: santeGranola.id }
            });
            console.log("  ✅ Sante -> 'جرانولا وموسلي'");
        }

        // Target 2: ألواح الطاقة والبروتين
        let santeBars = await prisma.category.findFirst({
            where: { brandId: sante.id, name: { in: ["ألواح الطاقة والبروتين", "ألواح الحبوب وسناكس بار"] } }
        });
        if (santeBars) {
            santeBars = await prisma.category.update({
                where: { id: santeBars.id },
                data: { name: "ألواح الطاقة والبروتين", description: "Protein & Energy Bars", slug: "sante-energy-bars", isFeatured: true }
            });
            await prisma.product.updateMany({
                where: { brandId: sante.id, category: { name: "ألواح الحبوب وسناكس بار" } },
                data: { categoryId: santeBars.id }
            });
            console.log("  ✅ Sante -> 'ألواح الطاقة والبروتين'");
        }

        // Target 3: مقرمشات وبسكويت صحي
        let santeCrisps = await prisma.category.findFirst({
            where: { brandId: sante.id, name: { in: ["مقرمشات وبسكويت صحي", "بسكويت وسناكس صحي", "مقرمشات وخبز صحي", "مقرمشات وكعك الأرز"] } }
        });
        if (santeCrisps) {
            santeCrisps = await prisma.category.update({
                where: { id: santeCrisps.id },
                data: { name: "مقرمشات وبسكويت صحي", description: "Healthy Biscuits & Rice Cakes", slug: "sante-healthy-biscuits", isFeatured: true }
            });
            await prisma.product.updateMany({
                where: { brandId: sante.id, category: { name: { in: ["بسكويت وسناكس صحي", "مقرمشات وخبز صحي", "مقرمشات وكعك الأرز"] } } },
                data: { categoryId: santeCrisps.id }
            });
            console.log("  ✅ Sante -> 'مقرمشات وبسكويت صحي'");
        }

        // Target 4: زبدة المكسرات
        let santeButter = await prisma.category.findFirst({
            where: { brandId: sante.id, name: { in: ["زبدة المكسرات", "زبدة المكسرات والدهن"] } }
        });
        if (santeButter) {
            await prisma.category.update({
                where: { id: santeButter.id },
                data: { name: "زبدة المكسرات", description: "Nut Butters", slug: "sante-nut-butters", isFeatured: false }
            });
            console.log("  ✅ Sante -> 'زبدة المكسرات'");
        }

        // Delete empty Sante subcategories
        await prisma.category.deleteMany({
            where: {
                brandId: sante.id,
                products: { none: {} }
            }
        });
    }

    // =========================================================================
    // STEP 5: CONSOLIDATE HYGIENE SUBCATEGORIES (21 -> 5)
    // =========================================================================
    console.log("\n--- Step 5: Consolidating Hygiene Subcategories ---");
    const hygiene = await prisma.brand.findFirst({ where: { name: { contains: "Hygiene" } } });
    if (hygiene) {
        // Target 1: معقمات ومطهرات
        let hySanitizers = await prisma.category.findFirst({
            where: { brandId: hygiene.id, name: { in: ["معقمات ومطهرات", "معقمات ومطهرات اليدين", "معقمات ومطهرات الأسطح واليدين", "كحول وإسعافات أولية"] } }
        });
        if (hySanitizers) {
            hySanitizers = await prisma.category.update({
                where: { id: hySanitizers.id },
                data: { name: "معقمات ومطهرات", description: "Sanitizers & Disinfectants", slug: "hygiene-sanitizers", isFeatured: true }
            });
            await prisma.product.updateMany({
                where: { brandId: hygiene.id, category: { name: { in: ["معقمات ومطهرات اليدين", "معقمات ومطهرات الأسطح واليدين", "كحول وإسعافات أولية"] } } },
                data: { categoryId: hySanitizers.id }
            });
            console.log("  ✅ Hygiene -> 'معقمات ومطهرات'");
        }

        // Target 2: العناية بالفم والأسنان
        let hyOral = await prisma.category.findFirst({
            where: { brandId: hygiene.id, name: { in: ["العناية بالفم والأسنان", "غسول ومطهر الفم", "فرش أسنان"] } }
        });
        if (hyOral) {
            hyOral = await prisma.category.update({
                where: { id: hyOral.id },
                data: { name: "العناية بالفم والأسنان", description: "Oral Care", slug: "hygiene-oral-care", isFeatured: true }
            });
            await prisma.product.updateMany({
                where: { brandId: hygiene.id, category: { name: { in: ["العناية بالفم والأسنان", "غسول ومطهر الفم", "فرش أسنان"] } } },
                data: { categoryId: hyOral.id }
            });
            console.log("  ✅ Hygiene -> 'العناية بالفم والأسنان'");
        }

        // Target 3: العناية بالطفل
        let hyBaby = await prisma.category.findFirst({
            where: { brandId: hygiene.id, name: { in: ["العناية بالطفل", "شامبو وعناية بشعر الطفل", "العناية ببشرة الطفل", "معجون أسنان أطفال", "العناية بأسنان الأطفال", "مناديل مبللة للأطفال", "عطور وكولونيا الأطفال"] } }
        });
        if (hyBaby) {
            hyBaby = await prisma.category.update({
                where: { id: hyBaby.id },
                data: { name: "العناية بالطفل", description: "Baby Care", slug: "hygiene-baby-care", isFeatured: true }
            });
            await prisma.product.updateMany({
                where: { brandId: hygiene.id, category: { name: { in: ["شامبو وعناية بشعر الطفل", "العناية ببشرة الطفل", "معجون أسنان أطفال", "العناية بأسنان الأطفال", "مناديل مبللة للأطفال", "عطور وكولونيا الأطفال"] } } },
                data: { categoryId: hyBaby.id }
            });
            console.log("  ✅ Hygiene -> 'العناية بالطفل'");
        }

        // Target 4: صابون وغسول الاستحمام
        let hySoap = await prisma.category.findFirst({
            where: { brandId: hygiene.id, name: { in: ["صابون وغسول الاستحمام", "صابون صلب", "صابون وغسول اليدين", "جل استحمام وصابون سائل"] } }
        });
        if (hySoap) {
            hySoap = await prisma.category.update({
                where: { id: hySoap.id },
                data: { name: "صابون وغسول الاستحمام", description: "Soaps & Body Wash", slug: "hygiene-soaps-wash", isFeatured: true }
            });
            await prisma.product.updateMany({
                where: { brandId: hygiene.id, category: { name: { in: ["صابون صلب", "صابون وغسول اليدين", "جل استحمام وصابون سائل"] } } },
                data: { categoryId: hySoap.id }
            });
            console.log("  ✅ Hygiene -> 'صابون وغسول الاستحمام'");
        }

        // Target 5: العناية الشخصية
        let hyPersonal = await prisma.category.findFirst({
            where: { brandId: hygiene.id, name: { in: ["العناية الشخصية", "مزيلات ومقاومات العرق", "مستلزمات الحلاقة", "العناية بالأقدام", "العناية الشخصية النسائية", "مزيل طلاء الأظافر", "مناديل مبللة ومنظفة"] } }
        });
        if (hyPersonal) {
            hyPersonal = await prisma.category.update({
                where: { id: hyPersonal.id },
                data: { name: "العناية الشخصية", description: "Personal Care", slug: "hygiene-personal-care", isFeatured: true }
            });
            await prisma.product.updateMany({
                where: { brandId: hygiene.id, category: { name: { in: ["مزيلات ومقاومات العرق", "مستلزمات الحلاقة", "العناية بالأقدام", "العناية الشخصية النسائية", "مزيل طلاء الأظافر", "مناديل مبللة ومنظفة"] } } },
                data: { categoryId: hyPersonal.id }
            });
            console.log("  ✅ Hygiene -> 'العناية الشخصية'");
        }

        // Delete empty Hygiene subcategories
        await prisma.category.deleteMany({
            where: {
                brandId: hygiene.id,
                products: { none: {} }
            }
        });
    }

    // =========================================================================
    // STEP 6: CONSOLIDATE MAIN DEPARTMENTS (18 -> 11)
    // =========================================================================
    console.log("\n--- Step 6: Consolidating Main Departments ---");

    // 6.1 Pasta & Grains
    const pastaDept = await prisma.mainCategory.findFirst({ where: { slug: "pasta-grains" } }) || await prisma.mainCategory.findFirst({ where: { name: "باستا" } });
    const oldPastaDept = await prisma.mainCategory.findFirst({ where: { name: "معكرونة ومواد غذائية" } });
    if (pastaDept) {
        await prisma.mainCategory.update({
            where: { id: pastaDept.id },
            data: { name: "باستا ومعكرونة", description: "Pasta & Grains", slug: "pasta-grains", isFeatured: true }
        });
        if (oldPastaDept) {
            await prisma.product.updateMany({ where: { mainCategoryId: oldPastaDept.id }, data: { mainCategoryId: pastaDept.id } });
            await prisma.brand.updateMany({ where: { mainCategoryId: oldPastaDept.id }, data: { mainCategoryId: pastaDept.id } });
            await prisma.mainCategory.delete({ where: { id: oldPastaDept.id } });
            console.log("  ✅ Merged 'معكرونة ومواد غذائية' -> 'باستا ومعكرونة'");
        }
    }

    // 6.2 Dairy & Plant Milk
    const dairyDept = await prisma.mainCategory.findFirst({ where: { name: { in: ["مشروبات وبدائل الحليب", "ألبان وبدائل الحليب"] } } });
    if (dairyDept) {
        await prisma.mainCategory.update({
            where: { id: dairyDept.id },
            data: { name: "ألبان وبدائل الحليب", description: "Dairy & Plant Milk", slug: "dairy-plant-milk", isFeatured: false }
        });
        const deadDairy1 = await prisma.mainCategory.findFirst({ where: { name: "ألبان ومنتجات الطبخ" } });
        const deadDairy2 = await prisma.mainCategory.findFirst({ where: { name: "ألبان وبدائلها" } });
        if (deadDairy1) {
            await prisma.product.updateMany({ where: { mainCategoryId: deadDairy1.id }, data: { mainCategoryId: dairyDept.id } });
            await prisma.brand.updateMany({ where: { mainCategoryId: deadDairy1.id }, data: { mainCategoryId: dairyDept.id } });
            await prisma.mainCategory.delete({ where: { id: deadDairy1.id } });
        }
        if (deadDairy2) {
            await prisma.product.updateMany({ where: { mainCategoryId: deadDairy2.id }, data: { mainCategoryId: dairyDept.id } });
            await prisma.brand.updateMany({ where: { mainCategoryId: deadDairy2.id }, data: { mainCategoryId: dairyDept.id } });
            await prisma.mainCategory.delete({ where: { id: deadDairy2.id } });
        }
        console.log("  ✅ Merged Dairy departments -> 'ألبان وبدائل الحليب'");
    }

    // 6.3 Breakfast Cereals
    const cerealDept = await prisma.mainCategory.findFirst({ where: { name: { in: ["فطور وسيريال", "حبوب الإفطار"] } } });
    if (cerealDept) {
        await prisma.mainCategory.update({
            where: { id: cerealDept.id },
            data: { name: "حبوب الإفطار", description: "Breakfast Cereals", slug: "breakfast-cereals", isFeatured: true }
        });
        const deadBreakfast = await prisma.mainCategory.findFirst({ where: { name: "مأكولات وفطور" } });
        if (deadBreakfast) {
            await prisma.product.updateMany({ where: { mainCategoryId: deadBreakfast.id }, data: { mainCategoryId: cerealDept.id } });
            await prisma.brand.updateMany({ where: { mainCategoryId: deadBreakfast.id }, data: { mainCategoryId: cerealDept.id } });
            await prisma.mainCategory.delete({ where: { id: deadBreakfast.id } });
            console.log("  ✅ Merged 'مأكولات وفطور' -> 'حبوب الإفطار'");
        }
    }

    // 6.4 Healthy Snacks & Diet
    const healthyDept = await prisma.mainCategory.findFirst({ where: { name: { in: ["أغذية صحية ودايت", "أغذية صحية وسناكس"] } } });
    if (healthyDept) {
        await prisma.mainCategory.update({
            where: { id: healthyDept.id },
            data: { name: "أغذية صحية وسناكس", description: "Healthy Snacks & Diet", slug: "healthy-snacks", isFeatured: false }
        });
        const deadHealthy1 = await prisma.mainCategory.findFirst({ where: { name: "أغذية صحية ورياضية" } });
        const deadHealthy2 = await prisma.mainCategory.findFirst({ where: { name: "أغذية صحية وسناكس", id: { not: healthyDept.id } } });
        if (deadHealthy1) {
            await prisma.product.updateMany({ where: { mainCategoryId: deadHealthy1.id }, data: { mainCategoryId: healthyDept.id } });
            await prisma.brand.updateMany({ where: { mainCategoryId: deadHealthy1.id }, data: { mainCategoryId: healthyDept.id } });
            await prisma.mainCategory.delete({ where: { id: deadHealthy1.id } });
        }
        if (deadHealthy2) {
            await prisma.product.updateMany({ where: { mainCategoryId: deadHealthy2.id }, data: { mainCategoryId: healthyDept.id } });
            await prisma.brand.updateMany({ where: { mainCategoryId: deadHealthy2.id }, data: { mainCategoryId: healthyDept.id } });
            await prisma.mainCategory.delete({ where: { id: deadHealthy2.id } });
        }
        console.log("  ✅ Merged Healthy & Sports departments -> 'أغذية صحية وسناكس'");
    }

    console.log("\n🎉 CONSOLIDATION COMPLETE!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
