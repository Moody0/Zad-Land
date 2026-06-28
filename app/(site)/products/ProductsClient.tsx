"use client";

import React, { useEffect, useState } from "react";
import ProductsBreadcrumbs from "@/app/components/ProductsPageComponents/ProductsBreadcrumbs";
import ProductsHeader from "@/app/components/ProductsPageComponents/ProductsHeader";
import CategorySelector from "@/app/components/ProductsPageComponents/CategorySelector";
import ProductCard from "@/app/components/ProductsPageComponents/ProductCard";

import LoadMoreButton from "@/app/components/ProductsPageComponents/LoadMoreButton";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdSearchOff, MdKeyboardArrowDown } from "react-icons/md";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
}

interface Product {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: string;
    discountPrice?: string | null;
    images: string;
    brandId: string;
    categoryId: string;
    stock: number;
    isTrending: boolean;
    brand?: Brand | null;
}

interface Brand {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    group: string;
}

interface ProductsClientProps {
    initialCategories: Category[];
    initialProducts: Product[];
    initialTotal: number;
    activeCategory?: Category | null;
    activeBrand?: Brand | null;
    activeMainCategory?: { id: string; name: string; slug: string } | null;
}

const ProductsClient = ({
    initialCategories,
    initialProducts,
    initialTotal,
    activeCategory = null,
    activeBrand = null,
    activeMainCategory = null,
}: ProductsClientProps) => {
    const { t, language } = useLanguage();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [sort, setSort] = useState("best_sellers");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalProducts, setTotalProducts] = useState(initialTotal);
    const [isInitialRender, setIsInitialRender] = useState(true);

    const fetchProducts = async (reset = false) => {
        // Removed clearing products to avoid empty state without skeletons
        setLoading(true);

        try {
            const currentPage = reset ? 1 : page;
            const categoryQuery = activeCategory ? `&categoryIds=${activeCategory.id}` : "";
            const brandQuery = activeBrand ? `&brandIds=${activeBrand.id}` : "";
            const mainCategoryQuery = activeMainCategory ? `&mainCategoryId=${activeMainCategory.id}` : "";

            let sortQuery = "";
            if (sort === "Price: Low to High") sortQuery = "&sort=price_asc";
            else if (sort === "Price: High to Low") sortQuery = "&sort=price_desc";
            else if (sort === "Newest Arrivals") sortQuery = "&sort=newest";

            const response = await fetch(`/api/products?page=${currentPage}&limit=12${categoryQuery}${brandQuery}${mainCategoryQuery}${sortQuery}`);

            if (response.ok) {
                const data = await response.json();
                if (reset) {
                    setProducts(data.products);
                } else {
                    setProducts((previousProducts) => [...previousProducts, ...data.products]);
                }
                setTotalProducts(data.pagination.total);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false);
            if (sort !== "best_sellers") {
                setPage(1);
                fetchProducts(true);
            }
            return;
        }

        setPage(1);
        fetchProducts(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort]);

    useEffect(() => {
        if (page > 1) {
            fetchProducts(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleLoadMore = () => {
        setPage((previousPage) => previousPage + 1);
    };

    return (
        <div className="flex-1 container-custom py-8 md:py-10">
            <ProductsBreadcrumbs activeCategory={activeCategory} />

            <ProductsHeader activeCategory={activeCategory} activeBrand={activeBrand} />

            <CategorySelector categories={initialCategories} activeCategory={activeCategory} activeMainCategory={activeMainCategory} />

            <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("products.showing")} {products.length} {t("products.of")} {totalProducts} {t("products.results")}
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold tracking-wide text-[#7b676f] dark:text-white/55 uppercase whitespace-nowrap hidden sm:block">
                            {t('products.sortBy')}
                        </span>
                        <div className="relative">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className={`w-full sm:w-auto min-w-[200px] cursor-pointer appearance-none rounded-xl border border-[#ddd2d6] bg-white px-4 py-2.5 text-sm font-semibold text-[#181113] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all ${language === 'ar' ? 'pl-10 pr-4' : 'pr-10 pl-4'} dark:border-white/10 dark:bg-[#221d20] dark:text-white hover:border-[#c5b8bd] dark:hover:border-white/20`}
                            >
                                <option value="best_sellers">{t('products.bestSellers')}</option>
                                <option value="Price: Low to High">{t('products.priceLowHigh')}</option>
                                <option value="Price: High to Low">{t('products.priceHighLow')}</option>
                                <option value="Newest Arrivals">{t('products.newestArrivals')}</option>
                            </select>
                            <MdKeyboardArrowDown className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-xl text-primary ${language === 'ar' ? 'left-3' : 'right-3'}`} />
                        </div>
                    </div>
                </div>

                {products.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-[#eadfe2] bg-[#fff8fa] px-6 py-20 text-center dark:border-white/10 dark:bg-white/5">
                        <div className="mb-4 rounded-full bg-white p-4 shadow-sm dark:bg-white/10">
                            <MdSearchOff className="text-4xl text-gray-400" />
                        </div>
                        <p className="text-lg font-semibold text-[#22171b] dark:text-white">
                            {activeCategory ? t("products.noProductsInCategory") : t("products.noProducts")}
                        </p>
                        {activeCategory && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                {activeCategory.name}
                            </p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    {/* Removed ProductSkeleton per user request */}
                </div>

                <LoadMoreButton
                    handleLoadMore={handleLoadMore}
                    loading={loading}
                    hasMore={products.length < totalProducts}
                />
            </div>
        </div>
    );
};

export default ProductsClient;
