const { PrismaClient, BrandGroup } = require('@prisma/client');
const xlsx = require('xlsx');
const slugify = require('slugify');

const prisma = new PrismaClient();
const filePath = 'C:\\Users\\moham\\Downloads\\زاد لاند.xlsx';

function cleanSlug(text) {
    const slug = slugify(text || 'item', { lower: true, strict: true, trim: true });
    return slug || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function parsePrice(rawVal) {
    if (rawVal === undefined || rawVal === null || rawVal === '' || rawVal === 0 || rawVal === '0') {
        return 0;
    }
    if (typeof rawVal === 'string') {
        const cleaned = rawVal.trim();
        if (cleaned === '2.31.93') return 2.31;
        const dots = (cleaned.match(/\./g) || []).length;
        if (dots > 1) {
            const parts = cleaned.split('.');
            return parseFloat(`${parts[0]}.${parts[1]}`) || 0;
        }
        const num = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
        return !isNaN(num) ? num : 0;
    }
    if (typeof rawVal === 'number' && !isNaN(rawVal)) {
        return Number(rawVal);
    }
    return 0;
}

// Brand mapping with English names, groups, and logos
const BRAND_MAP = {
    'علي كافيه': { en: 'Alicafe', slug: 'alicafe', group: BrandGroup.MAIN, image: '/uploads/brands/1787218720317-533737981.webp' },
    'امريكانا': { en: 'Americana', slug: 'americana', group: BrandGroup.MAIN, image: '/uploads/brands/1787218793665-7408373.webp' },
    'اميركانا': { en: 'Americana', slug: 'americana', group: BrandGroup.MAIN, image: '/uploads/brands/1787218793665-7408373.webp' },
    'اميركان جاردن': { en: 'American Garden', slug: 'american-garden', group: BrandGroup.MAIN, image: '/uploads/brands/1787218780732-876013491.webp' },
    'تات': { en: 'Tat', slug: 'tat', group: BrandGroup.MAIN, image: '/uploads/brands/1787218863869-591004394.webp' },
    'ماستر براوني': { en: 'Mr. Brownie', slug: 'mr-brownie', group: BrandGroup.MAIN, image: '/uploads/brands/1787218834786-329403477.webp' },
    'اوتيما': { en: 'Ottima', slug: 'ottima', group: BrandGroup.MAIN, image: '/uploads/brands/1787219350458-201678975.webp' },
    'كابتن فيشر': { en: 'Captain Fisher', slug: 'captain-fisher', group: BrandGroup.MAIN, image: '/uploads/brands/1787219236406-485497809.webp' },
    'ريو ماري الايطالي': { en: 'Rio Mare', slug: 'rio-mare', group: BrandGroup.MAIN, image: '/uploads/brands/1787218851081-615253174.webp' },
    'هايجين': { en: 'Hygiene', slug: 'hygiene', group: BrandGroup.MAIN, image: '/uploads/brands/1787218827141-37442807.webp' },
    'سانتي': { en: 'Sante', slug: 'sante', group: BrandGroup.MAIN, image: '/uploads/brands/1787218858040-140800254.webp' },
    'غو اون': { en: 'Go On', slug: 'go-on', group: BrandGroup.MAIN, image: '/uploads/brands/1787219778840-394332734.webp' },
    'نبيل': { en: 'Nabil', slug: 'nabil', group: BrandGroup.MAIN, image: '/uploads/brands/1787218842962-605908044.webp' },
    'غورمت': { en: 'Gourmet', slug: 'gourmet', group: BrandGroup.DIFFERENT, image: '/uploads/brands/1787220259940-287240000.webp' },
    'غرومت': { en: 'Gourmet', slug: 'gourmet', group: BrandGroup.DIFFERENT, image: '/uploads/brands/1787220259940-287240000.webp' },
    'بيبسي': { en: 'Pepsi', slug: 'pepsi', group: BrandGroup.DIFFERENT, image: '/uploads/brands/1787219455604-381017971.webp' },
    'ماستر شيف': { en: 'Master Chef', slug: 'master-chef', group: BrandGroup.DIFFERENT, image: '/uploads/brands/1787220458700-559169481.webp' },
    'بوم بوم': { en: 'Boom Boom', slug: 'boom-boom', group: BrandGroup.DIFFERENT, image: '/uploads/brands/1787220321779-201459975.webp' },
    'اولداغ': { en: 'Uludag', slug: 'uludag', group: BrandGroup.DIFFERENT, image: '/uploads/brands/1787219544048-744122825.webp' },
    'لوفيج': { en: 'Lovege', slug: 'lovege', group: BrandGroup.DIFFERENT, image: '/uploads/brands/1787219647504-338133809.webp' },
    'ميلاف': { en: 'Milaf', slug: 'milaf', group: BrandGroup.DIFFERENT, image: '/uploads/brands/1787218880234-395426325.webp' },
    'ندى': { en: 'Nada', slug: 'nada', group: BrandGroup.MAIN, image: '/uploads/brands/1787219815394-285916661.webp' },
    'مرسين': { en: 'Mersin', slug: 'mersin', group: BrandGroup.DIFFERENT, image: null },
    'غولدين سيب': { en: 'Golden Sip', slug: 'golden-sip', group: BrandGroup.DIFFERENT, image: null },
    'جوكر': { en: 'Joker', slug: 'joker', group: BrandGroup.DIFFERENT, image: null },
    'ديشكو باستا': { en: 'De Cecco Italy', slug: 'de-cecco-italy', group: BrandGroup.MAIN, image: '/uploads/brands/1787221305630-331900677.webp' },
    'سانينو+دورو': { en: 'Duru & Sanino', slug: 'duru-sanino', group: BrandGroup.MAIN, image: '/uploads/brands/1787218788676-939433594.webp' },
    'دورو': { en: 'Duru', slug: 'duru-sanino', group: BrandGroup.MAIN, image: '/uploads/brands/1787218788676-939433594.webp' },
    'سانينو+دورو( نمبر1)': { en: 'Duru & Sanino', slug: 'duru-sanino', group: BrandGroup.MAIN, image: '/uploads/brands/1787218788676-939433594.webp' },
};

// Main category mapping
const MAIN_CATEGORY_MAP = {
    'مشروبات': { en: 'Beverages & Coffee', slug: 'beverages-coffee' },
    'لحوم باردة': { en: 'Cold Cuts & Meats', slug: 'cold-cuts' },
    'صوصات وصلصات': { en: 'Sauces & Condiments', slug: 'sauces-condiments' },
    'نقرشات': { en: 'Snacks & Sweets', slug: 'snacks-sweets' },
    'السناكس والحلويات': { en: 'Snacks & Sweets', slug: 'snacks-sweets' },
    'باستا': { en: 'Pasta & Grains', slug: 'pasta-grains' },
    'مفزرات': { en: 'Frozen Foods', slug: 'frozen-foods' },
    'مفرزات': { en: 'Frozen Foods', slug: 'frozen-foods' },
    'مفرزات ولحوم': { en: 'Frozen Foods', slug: 'frozen-foods' },
    'منظفات': { en: 'Personal Care & Hygiene', slug: 'personal-care-hygiene' },
    'غذائيات': { en: 'Canned & General Goods', slug: 'canned-goods' },
    'معلبات': { en: 'Canned Goods', slug: 'canned-goods' },
};

async function executeReimport() {
    console.log("================ STARTING CLEAN RE-IMPORT ================");
    console.log(`Reading Excel file: ${filePath}`);
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = xlsx.utils.sheet_to_json(sheet, { defval: '' });
    console.log(`Loaded ${rawData.length} products from Excel.`);

    // 1. Initialize Main Categories
    console.log("\n1. Initializing Main Categories...");
    const mainCategoryDbMap = {};
    for (const [arName, config] of Object.entries(MAIN_CATEGORY_MAP)) {
        const canonicalAr = (arName === 'مفزرات') ? 'مفرزات' : arName;
        const mainCat = await prisma.mainCategory.upsert({
            where: { slug: config.slug },
            update: {
                name: canonicalAr,
                isActive: true,
                showInNav: true,
            },
            create: {
                name: canonicalAr,
                slug: config.slug,
                description: config.en,
                isActive: true,
                showInNav: true,
            }
        });
        mainCategoryDbMap[arName] = mainCat;
        mainCategoryDbMap[canonicalAr] = mainCat;
    }
    console.log("[DONE] Main Categories ready.");

    // 2. Initialize / Upsert Brands with existing logos
    console.log("\n2. Initializing Brands with their logos...");
    const brandDbMap = {};
    for (const [arName, info] of Object.entries(BRAND_MAP)) {
        const canonicalAr = arName.replace(/\(.*\)/, '').trim();
        const brand = await prisma.brand.upsert({
            where: { slug: info.slug },
            update: {
                name: `${info.en} - ${canonicalAr}`,
                group: info.group,
                image: info.image || undefined,
                isActive: true,
            },
            create: {
                name: `${info.en} - ${canonicalAr}`,
                slug: info.slug,
                group: info.group,
                image: info.image || null,
                isActive: true,
            }
        });
        brandDbMap[arName] = brand;
    }
    console.log("[DONE] Brands ready.");

    // 3. Clear existing Products and Categories cleanly
    console.log("\n3. Cleaning old products and categories...");
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    console.log("[DONE] Database cleared for clean import.");

    // 4. Import all products
    console.log("\n4. Importing products from Excel...");
    const categoryCache = {};
    const usedProductSlugs = new Set();
    let importedCount = 0;

    for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i];
        const rowNum = i + 2;

        // Main Category Handling
        const rawMainCat = String(row['القسم الرئيسي'] || 'غذائيات').trim();
        const normalizedMainCat = rawMainCat === 'مفزرات' ? 'مفرزات' : rawMainCat;
        const mainCatRecord = mainCategoryDbMap[normalizedMainCat] || mainCategoryDbMap['غذائيات'] || Object.values(mainCategoryDbMap)[0];

        // Brand Handling
        let rawBrand = String(row['اسم الماركة'] || '').trim();
        if (!rawBrand) {
            // Default brand if missing (e.g. Lovege for soy milk)
            rawBrand = 'لوفيج';
        }
        const brandRecord = brandDbMap[rawBrand] || brandDbMap['زاد لاند'] || Object.values(brandDbMap)[0];

        // Subcategory Handling: If missing, use the Main Category name as requested!
        let rawSubCat = String(row['القسم الفرعي'] || '').trim();
        if (!rawSubCat) {
            rawSubCat = normalizedMainCat; // Use Main Category name if Sub Category is empty
        }

        const subCatCacheKey = `${brandRecord.id}:${mainCatRecord.id}:${rawSubCat}`;
        let categoryRecord = categoryCache[subCatCacheKey];
        if (!categoryRecord) {
            const subCatSlug = `${cleanSlug(brandRecord.slug)}-${cleanSlug(rawSubCat)}`;
            categoryRecord = await prisma.category.upsert({
                where: { slug: subCatSlug },
                update: {
                    name: rawSubCat,
                    brandId: brandRecord.id,
                    mainCategoryId: mainCatRecord.id,
                },
                create: {
                    name: rawSubCat,
                    slug: subCatSlug,
                    brandId: brandRecord.id,
                    mainCategoryId: mainCatRecord.id,
                }
            });
            categoryCache[subCatCacheKey] = categoryRecord;
        }

        // Product fields
        const nameAr = String(row['اسم المنتج بالعربي'] || '').trim();
        const nameEn = String(row['اسم المنتج بالإنجليزي'] || nameAr).trim();
        const descAr = String(row['وصف المنتج بالعربي'] || nameAr).trim();
        const descEn = String(row['وصف المنتج بالإنجليزي'] || nameEn).trim();
        const price = parsePrice(row['السعر']);
        const stock = parseInt(row['الكمية']) || 24;
        const options = String(row['الخيارات'] || '').trim() || null;

        // Image Handling (Handling shifted column __EMPTY for Ali Cafe)
        let imgUrl = String(row['رابط صورة المنتج'] || '').trim();
        if (!imgUrl && row['__EMPTY']) {
            imgUrl = String(row['__EMPTY']).trim();
        }

        const images = (imgUrl && (imgUrl.startsWith('http') || imgUrl.startsWith('/')))
            ? imgUrl
            : '/placeholder.svg';

        // Unique Slug Generation
        let baseSlug = cleanSlug(nameEn || nameAr);
        let productSlug = baseSlug;
        let counter = 1;
        while (usedProductSlugs.has(productSlug)) {
            productSlug = `${baseSlug}-${counter}`;
            counter++;
        }
        usedProductSlugs.add(productSlug);

        await prisma.product.create({
            data: {
                name: nameEn || nameAr,
                nameAr: nameAr,
                nameEn: nameEn,
                description: descEn || descAr,
                descriptionAr: descAr,
                descriptionEn: descEn,
                price: price,
                stock: stock,
                slug: productSlug,
                options: options,
                images: images,
                brandId: brandRecord.id,
                categoryId: categoryRecord.id,
                mainCategoryId: mainCatRecord.id,
                isTrending: i % 12 === 0, // Mark select diverse products as trending
            }
        });

        importedCount++;
        if (importedCount % 50 === 0 || importedCount === rawData.length) {
            console.log(`Progress: Imported ${importedCount}/${rawData.length} products...`);
        }
    }

    console.log(`\n======================================================`);
    console.log(`SUCCESS: ${importedCount} products successfully imported!`);
    console.log(`======================================================`);
}

executeReimport()
    .catch(err => {
        console.error("Re-import failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
