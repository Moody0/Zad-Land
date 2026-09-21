const { PrismaClient, BrandGroup } = require('@prisma/client');
const XLSX = require('xlsx');
const slugify = require('slugify');

const prisma = new PrismaClient();
const filePath = 'C:\\Users\\moham\\Downloads\\زاد لاند نهائي .xlsx';
const applyChanges = process.argv.includes('--apply');

const BRAND_CONFIG = {
    'علي كافيه': { en: 'Alicafe', slug: 'alicafe', group: BrandGroup.MAIN },
    'امريكانا': { en: 'Americana', slug: 'americana', group: BrandGroup.MAIN },
    'اميركان جاردن': { en: 'American Garden', slug: 'american-garden', group: BrandGroup.MAIN },
    'تات': { en: 'Tat', slug: 'tat', group: BrandGroup.MAIN },
    'ماستر براوني': { en: 'Mr. Brownie', slug: 'mr-brownie', group: BrandGroup.MAIN },
    'اوتيما': { en: 'Ottima', slug: 'ottima', group: BrandGroup.MAIN },
    'كابتن فيشر': { en: 'Captain Fisher', slug: 'captain-fisher', group: BrandGroup.MAIN },
    'ريو ماري الايطالي': { en: 'Rio Mare', slug: 'rio-mare', group: BrandGroup.MAIN },
    'هايجين': { en: 'Hygiene', slug: 'hygiene', group: BrandGroup.MAIN },
    'سانتي': { en: 'Sante', slug: 'sante', group: BrandGroup.MAIN },
    'غو اون': { en: 'Go On', slug: 'go-on', group: BrandGroup.MAIN },
    'نبيل': { en: 'Nabil', slug: 'nabil', group: BrandGroup.MAIN },
    'ندى': { en: 'Nada', slug: 'nada', group: BrandGroup.MAIN },
    'ديشكو باستا': { en: 'De Cecco Italy', slug: 'de-cecco-italy', group: BrandGroup.MAIN },
    'دورو': { en: 'Duru', slug: 'duru', group: BrandGroup.MAIN },
    'سانينو': { en: 'Sanino', slug: 'sanino', group: BrandGroup.MAIN },
    'غورمت': { en: 'Gourmet', slug: 'gourmet', group: BrandGroup.DIFFERENT },
    'بيبسي': { en: 'Pepsi', slug: 'pepsi', group: BrandGroup.DIFFERENT },
    'ماستر شيف': { en: 'Master Chef', slug: 'master-chef', group: BrandGroup.DIFFERENT },
    'بوم بوم': { en: 'Boom Boom', slug: 'boom-boom', group: BrandGroup.DIFFERENT },
    'اولداغ': { en: 'Uludag', slug: 'uludag', group: BrandGroup.DIFFERENT },
    'لوفيج': { en: 'Lovege', slug: 'lovege', group: BrandGroup.DIFFERENT },
    'ميلاف': { en: 'Milaf', slug: 'milaf', group: BrandGroup.DIFFERENT },
    'مرسين': { en: 'Mersin', slug: 'mersin', group: BrandGroup.DIFFERENT },
    'غولدين سيب': { en: 'Golden Sip', slug: 'golden-sip', group: BrandGroup.DIFFERENT },
    'جوكر': { en: 'Joker', slug: 'joker', group: BrandGroup.DIFFERENT },
    'ديربي': { en: 'Derby', slug: 'derby', group: BrandGroup.DIFFERENT },
    'اركو': { en: 'Arko', slug: 'arko', group: BrandGroup.DIFFERENT },
    'ايموشن': { en: 'Emotion', slug: 'emotion', group: BrandGroup.DIFFERENT },
    'نمبر1': { en: 'Number 1', slug: 'number-1', group: BrandGroup.DIFFERENT },
    'زاد لاند': { en: 'Zad Land', slug: 'zad-land', group: BrandGroup.MAIN },
};

const MAIN_CATEGORY_CONFIG = {
    'مشروبات': { description: 'Beverages & Coffee', slug: 'beverages-coffee' },
    'مفرزات': { description: 'Frozen Foods', slug: 'frozen-foods' },
    'منظفات': { description: 'Personal Care & Hygiene', slug: 'personal-care-hygiene' },
    'غذائيات': { description: 'Canned & General Goods', slug: 'canned-goods' },
    'نقرشات': { description: 'Snacks & Sweets', slug: 'snacks-sweets' },
};

function text(value) {
    return value === undefined || value === null ? '' : String(value).replace(/\s+/g, ' ').trim();
}

function normalizeBrand(raw) {
    const value = text(raw);
    if (!value) return '';
    if (value === 'اميركانا') return 'امريكانا';
    if (value === 'غرومت') return 'غورمت';
    if (value === 'ريربي') return 'ديربي';
    return value;
}

function normalizeMainCategory(raw) {
    const value = text(raw);
    if (value === 'مفزرات') return 'مفرزات';
    return value;
}

function parsePrice(value) {
    if (value === undefined || value === null || value === '') return 0;
    if (typeof value === 'number' && value >= 44000 && value <= 48000) {
        const date = new Date(Math.round((value - 25569) * 86400 * 1000));
        return Number(`${date.getUTCMonth() + 1}.${date.getUTCDate()}`);
    }
    const raw = text(value).replace(/[^0-9.\-]/g, '');
    if (!raw) return 0;
    const parts = raw.split('.');
    if (parts.length > 2) return Number(`${parts[0]}.${parts[1]}`) || 0;
    return Number(raw) || 0;
}

function parseStock(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.max(0, Math.round(number)) : 0;
}

function cleanSlug(value, fallback) {
    return slugify(text(value), { lower: true, strict: true, trim: true }) || fallback;
}

function validImage(value) {
    const candidate = text(value);
    return candidate && candidate !== '0' && (/^https?:\/\//i.test(candidate) || candidate.startsWith('/'))
        ? candidate
        : null;
}

function buildSource() {
    const workbook = XLSX.readFile(filePath, { cellDates: false });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null, raw: true });
    const required = [
        'القسم الرئيسي',
        'القسم الفرعي',
        'اسم المنتج بالعربي',
        'اسم المنتج بالإنجليزي',
        'السعر',
    ];
    const headers = Object.keys(rows[0] || {});
    const missingHeaders = required.filter((header) => !headers.includes(header));
    if (missingHeaders.length) throw new Error(`Missing workbook columns: ${missingHeaders.join(', ')}`);
    if (!rows.length) throw new Error('The workbook contains no product rows.');

    const products = rows.map((row, index) => {
        const rowNumber = index + 2;
        const mainCategoryName = normalizeMainCategory(row['القسم الرئيسي']);
        const subCategoryName = text(row['القسم الفرعي']) || mainCategoryName;
        const nameAr = text(row['اسم المنتج بالعربي']);
        const nameEn = text(row['اسم المنتج بالإنجليزي']) || nameAr;
        if (!mainCategoryName || !nameAr || !nameEn) {
            throw new Error(`Row ${rowNumber} is missing a main category or product name.`);
        }
        if (!MAIN_CATEGORY_CONFIG[mainCategoryName]) {
            throw new Error(`Row ${rowNumber} has unsupported main category: ${mainCategoryName}`);
        }

        let brandName = normalizeBrand(row['اسم الماركة']);
        if (!brandName) {
            brandName = nameEn.toLowerCase().includes('soy milk') ? 'لوفيج' : 'زاد لاند';
        }
        if (!BRAND_CONFIG[brandName]) {
            throw new Error(`Row ${rowNumber} has unsupported brand: ${brandName}`);
        }

        const images = [validImage(row['رابط صورة المنتج']), validImage(row['__EMPTY'])].filter(Boolean);
        const descAr = text(row['وصف المنتج بالعربي']) || nameAr;
        const descEn = text(row['وصف المنتج بالإنجليزي']) || nameEn;
        return {
            rowNumber,
            mainCategoryName,
            subCategoryName,
            brandName,
            nameAr,
            nameEn,
            descAr,
            descEn,
            price: parsePrice(row['السعر']),
            stock: parseStock(row['الكمية']),
            options: text(row['الخيارات']) || null,
            images: images.length ? images.join(',') : '/placeholder.svg',
        };
    });

    return { sheetName, products };
}

function sourceBrandRecord(brandName) {
    const config = BRAND_CONFIG[brandName];
    return {
        name: `${config.en} - ${brandName}`,
        slug: config.slug,
        group: config.group,
        isActive: true,
        mainCategoryId: null,
    };
}

async function run() {
    const source = buildSource();
    const brandNames = [...new Set(source.products.map((product) => product.brandName))];
    const categoryKeys = new Set(source.products.map((product) => `${product.brandName}|${product.mainCategoryName}|${product.subCategoryName}`));
    const duplicateNames = source.products.reduce((map, product) => {
        map.set(product.nameEn, (map.get(product.nameEn) || 0) + 1);
        return map;
    }, new Map());
    const duplicateNameCount = [...duplicateNames.values()].filter((count) => count > 1).length;

    const [orderItems, reviews, existingProducts, existingCategories, existingMainCategories] = await Promise.all([
        prisma.orderItem.count(),
        prisma.review.count(),
        prisma.product.count(),
        prisma.category.count(),
        prisma.mainCategory.count(),
    ]);

    console.log(JSON.stringify({
        mode: applyChanges ? 'APPLY' : 'DRY RUN',
        sourceSheet: source.sheetName,
        sourceProducts: source.products.length,
        sourceBrands: brandNames.length,
        sourceCategories: categoryKeys.size,
        duplicateEnglishNameGroups: duplicateNameCount,
        existingProducts,
        existingCategories,
        existingMainCategories,
        existingReviews: reviews,
        existingOrderItems: orderItems,
    }, null, 2));

    if (!applyChanges) {
        console.log('Dry run complete. Re-run with --apply to replace the catalog.');
        return;
    }
    if (orderItems > 0) {
        throw new Error(`Refusing to delete products because ${orderItems} order items still reference them.`);
    }

    const result = await prisma.$transaction(async (tx) => {
        const oldMainCategories = await tx.mainCategory.findMany();
        const oldCategories = await tx.category.findMany({ include: { brand: true, mainCategory: true } });
        const oldMainBySlug = new Map(oldMainCategories.map((category) => [category.slug, category]));
        const oldCategoryByKey = new Map(oldCategories.map((category) => [
            `${category.brand.slug}|${category.mainCategory?.slug || ''}|${category.name.trim().toLowerCase()}`,
            category,
        ]));

        await tx.review.deleteMany({});
        await tx.product.deleteMany({});
        await tx.category.deleteMany({});
        await tx.brand.updateMany({ data: { mainCategoryId: null } });
        await tx.mainCategory.deleteMany({});

        const mainCategoryMap = new Map();
        for (const [name, config] of Object.entries(MAIN_CATEGORY_CONFIG)) {
            const old = oldMainBySlug.get(config.slug);
            const created = await tx.mainCategory.create({
                data: {
                    name,
                    slug: config.slug,
                    description: config.description,
                    image: old?.image || null,
                    isActive: old?.isActive ?? true,
                    showInNav: old?.showInNav ?? true,
                    navOrder: old?.navOrder ?? 0,
                    isFeatured: old?.isFeatured ?? false,
                },
            });
            mainCategoryMap.set(name, created);
        }

        const brandMap = new Map();
        for (const brandName of brandNames) {
            const data = sourceBrandRecord(brandName);
            const existing = await tx.brand.findUnique({ where: { slug: data.slug } });
            const brand = existing
                ? await tx.brand.update({ where: { id: existing.id }, data })
                : await tx.brand.create({ data });
            brandMap.set(brandName, brand);
        }
        await tx.brand.updateMany({
            where: { slug: { notIn: brandNames.map((brandName) => BRAND_CONFIG[brandName].slug) } },
            data: { isActive: false, mainCategoryId: null },
        });

        const categoryMap = new Map();
        for (const product of source.products) {
            const mainCategory = mainCategoryMap.get(product.mainCategoryName);
            const brand = brandMap.get(product.brandName);
            const key = `${product.brandName}|${product.mainCategoryName}|${product.subCategoryName}`;
            if (categoryMap.has(key)) continue;

            const categorySlug = `${brand.slug}-${mainCategory.slug}-${cleanSlug(product.subCategoryName, 'general')}`;
            const old = oldCategoryByKey.get(`${brand.slug}|${mainCategory.slug}|${product.subCategoryName.toLowerCase()}`);
            const category = await tx.category.create({
                data: {
                    name: product.subCategoryName,
                    slug: categorySlug,
                    description: old?.description || `Products for ${product.subCategoryName}`,
                    image: old?.image || null,
                    isFeatured: old?.isFeatured ?? false,
                    brandId: brand.id,
                    mainCategoryId: mainCategory.id,
                },
            });
            categoryMap.set(key, category);
        }

        const usedSlugs = new Set();
        const productRows = [];
        for (const product of source.products) {
            const brand = brandMap.get(product.brandName);
            const mainCategory = mainCategoryMap.get(product.mainCategoryName);
            const category = categoryMap.get(`${product.brandName}|${product.mainCategoryName}|${product.subCategoryName}`);
            const baseSlug = cleanSlug(product.nameEn || product.nameAr, `product-${product.rowNumber}`);
            let slug = baseSlug;
            let suffix = 1;
            while (usedSlugs.has(slug)) slug = `${baseSlug}-${suffix++}`;
            usedSlugs.add(slug);

            productRows.push({
                name: product.nameEn || product.nameAr,
                nameAr: product.nameAr,
                nameEn: product.nameEn,
                slug,
                images: product.images,
                isTrending: false,
                description: product.descEn || product.descAr,
                descriptionAr: product.descAr,
                descriptionEn: product.descEn,
                price: product.price,
                discountPrice: null,
                discountType: null,
                discountValue: null,
                stock: product.stock,
                options: product.options,
                categoryId: category.id,
                brandId: brand.id,
                mainCategoryId: mainCategory.id,
                sku: null,
            });
        }

        await tx.product.createMany({ data: productRows });

        return {
            importedProducts: productRows.length,
            createdMainCategories: mainCategoryMap.size,
            createdCategories: categoryMap.size,
            sourceBrands: brandMap.size,
        };
    }, { maxWait: 10000, timeout: 120000 });

    const [products, categories, mainCategories, reviewsAfter, productsByMainCategory] = await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.mainCategory.count(),
        prisma.review.count(),
        prisma.mainCategory.findMany({
            orderBy: { name: 'asc' },
            select: { name: true, slug: true, _count: { select: { products: true, categories: true } } },
        }),
    ]);

    console.log(JSON.stringify({
        ...result,
        verified: { products, categories, mainCategories, reviewsAfter, productsByMainCategory },
    }, null, 2));
}

run()
    .catch((error) => {
        console.error('Catalog replacement failed:', error.message);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
