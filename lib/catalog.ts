import { prisma } from "./prisma";

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

export async function getCatalogBrands() {
    return prisma.brand.findMany({
        where: { isActive: true },
        orderBy: [
            { group: "asc" },
            { isFeatured: "desc" },
            { name: "asc" },
        ],
        select: catalogBrandSelect,
    });
}

export async function getBrandBySlug(slug: string) {
    return prisma.brand.findFirst({
        where: {
            slug,
            isActive: true,
        },
        select: catalogBrandSelect,
    });
}

export async function getCatalogCategories(brandId?: string) {
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
}

export async function getFooterCategories(preferredIds: string[] = []) {
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
}

export async function getCategoryBySlug(slug: string) {
    return prisma.category.findFirst({
        where: {
            slug,
            brand: { isActive: true },
        },
        select: catalogCategorySelect,
    });
}

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

    const [categories, products, totalProducts] = await Promise.all([
        getCatalogCategories(brandId),
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
            ...product,
            price: product.price.toString(),
            discountPrice: product.discountPrice?.toString() || null,
        })),
        totalProducts,
    };
}
