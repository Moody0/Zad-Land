const { PrismaClient, BrandGroup } = require('@prisma/client');
const xlsx = require('xlsx');
const slugify = require('slugify');

const prisma = new PrismaClient();
const filePath = "C:\\Users\\moham\\Downloads\\Zad Land\\Zad Land Products.xlsx";

function cleanSlug(text) {
    const slug = slugify(text || 'product', { lower: true, strict: true, trim: true });
    return slug || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function parsePrice(rawVal, rowIdx) {
    if (rawVal === undefined || rawVal === null || rawVal === '' || rawVal === 0 || rawVal === '0') {
        return 0;
    }

    if (typeof rawVal === 'string') {
        const cleaned = rawVal.trim();
        if (cleaned === '2.31.93') {
            return 2.31;
        }
        if (cleaned.split('.').length > 2) {
            const parts = cleaned.split('.');
            return parseFloat(`${parts[0]}.${parts[1]}`) || 0;
        }
        const num = parseFloat(cleaned);
        if (!isNaN(num)) {
            rawVal = num;
        } else {
            return 0;
        }
    }

    if (typeof rawVal === 'number' && rawVal >= 44000 && rawVal <= 48000) {
        const date = new Date(Math.round((rawVal - 25569) * 86400 * 1000));
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        return parseFloat(`${month}.${day}`);
    }

    if (typeof rawVal === 'number' && !isNaN(rawVal)) {
        return Number(rawVal);
    }

    return 0;
}

const BRAND_ENGLISH_MAP = {
    'علي كافيه': { en: 'Alicafe', group: BrandGroup.MAIN },
    'امريكانا': { en: 'Americana', group: BrandGroup.MAIN },
    'اميركانا': { en: 'Americana', group: BrandGroup.MAIN },
    'اميركان جاردن': { en: 'American Garden', group: BrandGroup.MAIN },
    'تات': { en: 'Tat', group: BrandGroup.MAIN },
    'ماستر براوني': { en: 'Mr. Brownie', group: BrandGroup.MAIN },
    'اوتيما': { en: 'Ottima', group: BrandGroup.MAIN },
    'كابتن فيشر': { en: 'Captain Fisher', group: BrandGroup.MAIN },
    'ريو ماري الايطالي': { en: 'Rio Mare', group: BrandGroup.MAIN },
    'هايجين': { en: 'Hygiene', group: BrandGroup.MAIN },
    'سانتي': { en: 'Sante', group: BrandGroup.MAIN },
    'غو اون': { en: 'Go On', group: BrandGroup.MAIN },
    'نبيل': { en: 'Nabil', group: BrandGroup.MAIN },
    'غورمت': { en: 'Gourmet', group: BrandGroup.DIFFERENT },
    'بيبسي': { en: 'Pepsi', group: BrandGroup.DIFFERENT },
    'ماستر شيف': { en: 'Master Chef', group: BrandGroup.DIFFERENT },
    'بوم بوم': { en: 'Boom Boom', group: BrandGroup.DIFFERENT },
    'اولداغ': { en: 'Uludag', group: BrandGroup.DIFFERENT },
    'لوفيج': { en: 'Lovege', group: BrandGroup.DIFFERENT },
    'ميلاف': { en: 'Milaf', group: BrandGroup.DIFFERENT },
};

const MAIN_CATEGORY_MAP = {
    'مشروبات': { en: 'Beverages', slug: 'beverages' },
    'لحوم باردة': { en: 'Cold Cuts & Meats', slug: 'cold-cuts' },
    'صوصات وصلصات': { en: 'Sauces & Condiments', slug: 'sauces-condiments' },
    'السناكس والحلويات': { en: 'Snacks & Sweets', slug: 'snacks-sweets' },
    'باستا': { en: 'Pasta & Grains', slug: 'pasta-grains' },
    'مفزرات': { en: 'Frozen Foods', slug: 'frozen-foods' }, // typo fix
    'مفرزات': { en: 'Frozen Foods', slug: 'frozen-foods' },
    'مفرزات ولحوم': { en: 'Frozen Foods', slug: 'frozen-foods' },
    'معلبات': { en: 'Canned Goods', slug: 'canned-goods' },
    'العناية بالطفل': { en: 'Baby Care', slug: 'baby-care' },
    'العناية الشخصية والصحة': { en: 'Personal Care & Hygiene', slug: 'personal-care-hygiene' },
    'ألبان وبدائلها': { en: 'Dairy & Alternatives', slug: 'dairy-milk' },
    'ألبان ومنتجات الطبخ': { en: 'Dairy & Cooking', slug: 'dairy-cooking' },
    'أغذية صحية ودايت': { en: 'Healthy & Diet', slug: 'healthy-diet' },
    'فطور وسيريال': { en: 'Breakfast & Cereals', slug: 'breakfast-cereals' },
    'مأكولات وفطور': { en: 'Breakfast & Food', slug: 'breakfast-food' },
    'أغذية صحية ورياضية': { en: 'Sports Nutrition & Protein', slug: 'sports-nutrition' },
    'أغذية صحية وسناكس': { en: 'Healthy Snacks', slug: 'healthy-snacks' },
    'مشروبات وبدائل الحليب': { en: 'Beverages & Plant Milk', slug: 'beverages-plant-milk' },
};

async function importZadLandProducts() {
    console.log("=== STARTING ZAD LAND PRODUCTS IMPORT ===");
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets['Sheet1'];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    console.log(`Read ${rawData.length} products from Excel.`);

    // 1. Create / Upsert Main Categories
    const mainCategoryDbMap = {};
    for (const [arName, config] of Object.entries(MAIN_CATEGORY_MAP)) {
        const canonicalAr = arName === 'مفزرات' ? 'مفرزات' : arName;
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
    console.log("[PASS] Main Categories initialized.");

    // 2. Create / Upsert Brands
    const brandDbMap = {};
    for (const [arName, info] of Object.entries(BRAND_ENGLISH_MAP)) {
        const canonicalAr = (arName === 'اميركانا') ? 'امريكانا' : arName;
        const brandSlug = cleanSlug(info.en);
        const brand = await prisma.brand.upsert({
            where: { slug: brandSlug },
            update: {
                name: `${info.en} - ${canonicalAr}`,
                group: info.group,
                isActive: true,
            },
            create: {
                name: `${info.en} - ${canonicalAr}`,
                slug: brandSlug,
                group: info.group,
                isActive: true,
            }
        });
        brandDbMap[arName] = brand;
        brandDbMap[canonicalAr] = brand;
    }
    console.log("[PASS] Brands initialized.");

    // 3. Process Products
    const categoryCache = {};
    const usedSlugs = new Set();
    let importedCount = 0;

    for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i];
        const rawMainCat = (row['القسم الرئيسي'] || 'مفرزات').trim();
        const normalizedMainCat = rawMainCat === 'مفزرات' ? 'مفرزات' : rawMainCat;
        const mainCatRecord = mainCategoryDbMap[normalizedMainCat] || mainCategoryDbMap['مفرزات'];

        const rawBrand = (row['اسم الماركة'] || 'زاد لاند').trim();
        const normalizedBrand = rawBrand === 'اميركانا' ? 'امريكانا' : rawBrand;
        const brandRecord = brandDbMap[normalizedBrand] || brandDbMap['امريكانا'] || Object.values(brandDbMap)[0];

        const rawSubCat = (row['القسم الفرعي'] || 'عام').trim();
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

        const nameAr = (row['اسم المنتج بالعربي'] || '').trim();
        const nameEn = (row['اسم المنتج بالإنجليزي'] || '').trim();
        const descAr = (row['وصف المنتج بالعربي'] || nameAr).trim();
        const descEn = (row['وصف المنتج بالإنجليزي'] || nameEn).trim();
        const price = parsePrice(row['السعر'], i + 2);
        const qty = parseInt(row['الكمية']) || 24;
        const options = (row['الخيارات'] ? String(row['الخيارات']).trim() : null) || null;

        // Image Handling
        const img1 = row['رابط صورة المنتج'];
        const img2 = row['صورة مفرق'];
        const validImgs = [];
        if (img1 && typeof img1 === 'string' && img1.trim() && img1.trim() !== '0') {
            validImgs.push(img1.trim());
        }
        if (img2 && typeof img2 === 'string' && img2.trim() && img2.trim() !== '0') {
            validImgs.push(img2.trim());
        }

        // If no images found, use clean placeholder
        const imagesStr = validImgs.length > 0
            ? validImgs.join(',')
            : '/placeholder.svg';

        // Slug handling
        let baseSlug = cleanSlug(nameEn || nameAr);
        let slug = baseSlug;
        let counter = 1;
        while (usedSlugs.has(slug)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        usedSlugs.add(slug);

        const primaryName = nameEn || nameAr;
        const primaryDesc = descEn || descAr;

        await prisma.product.upsert({
            where: { slug },
            update: {
                name: primaryName,
                nameAr,
                nameEn,
                description: primaryDesc,
                descriptionAr: descAr,
                descriptionEn: descEn,
                price,
                stock: qty,
                options,
                images: imagesStr,
                brandId: brandRecord.id,
                categoryId: categoryRecord.id,
                mainCategoryId: mainCatRecord.id,
                isTrending: i % 15 === 0, // Flag a few diverse products as trending
            },
            create: {
                name: primaryName,
                nameAr,
                nameEn,
                description: primaryDesc,
                descriptionAr: descAr,
                descriptionEn: descEn,
                price,
                stock: qty,
                slug,
                options,
                images: imagesStr,
                brandId: brandRecord.id,
                categoryId: categoryRecord.id,
                mainCategoryId: mainCatRecord.id,
                isTrending: i % 15 === 0,
            }
        });

        importedCount++;
        if (importedCount % 50 === 0 || importedCount === rawData.length) {
            console.log(`Imported ${importedCount}/${rawData.length} products...`);
        }
    }

    console.log(`\n=== IMPORT COMPLETE: Successfully imported ${importedCount} products into Supabase Frankfurt! ===`);
}

importZadLandProducts()
    .catch(err => {
        console.error("Import error:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
