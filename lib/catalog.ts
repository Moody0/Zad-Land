import { prisma } from "./prisma";
import { cache } from "react";
import { unstable_cache } from "next/cache";

export interface CatalogCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    brandId: string;
    brand?: CatalogBrand | null;
}

export interface CatalogProduct {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: string;
    discountPrice: string | null;
    images: string;
    brandId: string;
    categoryId: string;
    stock: number;
    isTrending: boolean;
    brand?: CatalogBrand | null;
}

export interface CatalogBrand {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    group: "MAIN" | "DIFFERENT";
    isFeatured?: boolean;
}

const catalogCategorySelect = {
    id: true,
    name: true,
    slug: true,
    description: true,
    image: true,
    brandId: true,
    brand: {
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            image: true,
            group: true,
        },
    },
};

const catalogBrandSelect = {
    id: true,
    name: true,
    slug: true,
    description: true,
    image: true,
    group: true,
    isFeatured: true,
};

export const getCatalogBrands = cache(
    unstable_cache(
        async () => {
            return prisma.brand.findMany({
                where: { isActive: true },
                orderBy: [
                    { isFeatured: "desc" },
                    { name: "asc" },
                ],
                select: catalogBrandSelect,
            });
        },
        ["catalog-brands"],
        { tags: ["catalog", "brands"], revalidate: 3600 }
    )
);

export const getBrandBySlug = cache(async (slug: string) => {
    return unstable_cache(
        async () => {
            return prisma.brand.findFirst({
                where: {
                    slug,
                    isActive: true,
                },
                select: catalogBrandSelect,
            });
        },
        [`catalog-brand-${slug}`],
        { tags: ["catalog", "brands"], revalidate: 3600 }
    )();
});

export const getCatalogCategories = cache(async (brandId?: string) => {
    return unstable_cache(
        async () => {
            return prisma.category.findMany({
                where: {
                    brand: { isActive: true },
                    ...(brandId ? { brandId } : {}),
                },
                orderBy: [
                    { isFeatured: "desc" },
                    { name: "asc" },
                ],
                select: catalogCategorySelect,
            });
        },
        [`catalog-categories-${brandId || "all"}`],
        { tags: ["catalog", "categories"], revalidate: 3600 }
    )();
});

export const getFooterCategories = cache(async (preferredIds: string[] = []) => {
    const sanitizedIds = [...new Set(preferredIds.filter(Boolean))];

    if (sanitizedIds.length > 0) {
        const selectedCategories = await prisma.category.findMany({
            where: {
                id: {
                    in: sanitizedIds,
                },
                brand: { isActive: true },
            },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });

        const orderedSelectedCategories = sanitizedIds
            .map((id) => selectedCategories.find((category) => category.id === id))
            .filter((category): category is NonNullable<typeof category> => Boolean(category));

        if (orderedSelectedCategories.length > 0) {
            return orderedSelectedCategories;
        }
    }

    return prisma.category.findMany({
        where: {
            brand: { isActive: true },
        },
        take: 4,
        orderBy: [
            { isFeatured: "desc" },
            { name: "asc" },
        ],
        select: {
            id: true,
            name: true,
            slug: true,
        },
    });
});

export const getCategoryBySlug = cache(async (slug: string) => {
    return unstable_cache(
        async () => {
            return prisma.category.findFirst({
                where: {
                    slug,
                    brand: { isActive: true },
                },
                select: catalogCategorySelect,
            });
        },
        [`catalog-category-${slug}`],
        { tags: ["catalog", "categories"], revalidate: 3600 }
    )();
});

export const getCatalogMainCategories = cache(
    unstable_cache(
        async () => {
            const mainCategories = await prisma.mainCategory.findMany({
                where: {
                    isActive: true,
                    products: {
                        some: {
                            stock: { gt: 0 },
                            brand: { isActive: true },
                        },
                    },
                },
                orderBy: [
                    { navOrder: "asc" },
                    { name: "asc" },
                ],
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    image: true,
                },
            });

            return mainCategories.map((mc) => ({
                id: mc.id,
                name: mc.name,
                nameEn: mc.description || mc.name,
                slug: mc.slug,
                description: mc.description,
                image: mc.image,
            }));
        },
        ["catalog-main-categories"],
        { tags: ["catalog", "main-categories"], revalidate: 3600 }
    )
);

export async function getCatalogInitialData(categoryId?: string, brandId?: string, mainCategoryId?: string) {
    const whereClause: {
        stock: { gt: number };
        categoryId?: string;
        brandId?: string;
        mainCategoryId?: string;
        brand: { isActive: boolean };
    } = {
        stock: { gt: 0 },
        brand: { isActive: true },
    };

    if (categoryId) {
        whereClause.categoryId = categoryId;
    }

    if (brandId) {
        whereClause.brandId = brandId;
    }

    if (mainCategoryId) {
        whereClause.mainCategoryId = mainCategoryId;
    }

    const categoriesPromise = brandId 
        ? getCatalogCategories(brandId) 
        : getCatalogMainCategories();

    const [categories, products, totalProducts] = await Promise.all([
        categoriesPromise,
        prisma.product.findMany({
            where: whereClause,
            take: 12,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                brand: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        image: true,
                        group: true,
                    },
                },
            },
        }),
        prisma.product.count({
            where: whereClause,
        }),
    ]);

    return {
        categories,
        products: products.map((product) => ({
            id: product.id,
            slug: product.slug,
            name: product.name,
            nameAr: product.nameAr,
            nameEn: product.nameEn,
            description: product.description,
            descriptionAr: product.descriptionAr,
            descriptionEn: product.descriptionEn,
            price: product.price.toString(),
            discountPrice: product.discountPrice ? product.discountPrice.toString() : null,
            discountType: product.discountType,
            discountValue: product.discountValue ? product.discountValue.toString() : null,
            images: product.images,
            brandId: product.brandId,
            categoryId: product.categoryId,
            mainCategoryId: product.mainCategoryId,
            stock: product.stock,
            isTrending: product.isTrending,
            brand: product.brand ? {
                id: product.brand.id,
                name: product.brand.name,
                slug: product.brand.slug,
                description: product.brand.description,
                image: product.brand.image,
                group: product.brand.group,
            } : null,
        })),
        totalProducts,
    };
}
