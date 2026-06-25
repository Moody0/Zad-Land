"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdClose, MdKeyboardArrowRight, MdSearch } from "react-icons/md";
import { useLanguage } from "@/app/context/LanguageContext";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
}

interface CategorySelectorProps {
    categories: Category[];
    activeCategory?: Category | null;
    activeMainCategory?: { id: string; name: string; slug: string } | null;
}

function getCategoryHref(slug?: string | null) {
    return slug ? `/categories/${slug}` : "/products";
}

const CategorySelector = ({ categories, activeCategory = null, activeMainCategory = null }: CategorySelectorProps) => {
    const { t, dir } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    const filteredCategories = categories.filter((category) => {
        if (!search.trim()) {
            return true;
        }

        return category.name.toLowerCase().includes(search.toLowerCase());
    });

    const activeLabel = activeCategory?.name || activeMainCategory?.name || t("products.allProducts");

    const pillClassName = (isActive: boolean) =>
        `inline-flex items-center rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${
            isActive
                ? "border-primary bg-primary text-white"
                : "border-[#e7dadd] bg-white text-[#2b1d21] hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-primary/40"
        }`;

    const defaultHref = activeMainCategory ? `/department/${activeMainCategory.slug}` : "/products";
    const defaultText = activeMainCategory ? activeMainCategory.name : t("products.allProducts");

    return (
        <>
            <div className="hidden lg:block">
                <div className="rounded-[28px] border border-[#eadfe2] bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                    <div className="mb-4 flex flex-col gap-1">
                        <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary/70">
                            {t("products.browseCategories")}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("products.browseCategoriesHint")}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link href={defaultHref} className={pillClassName(!activeCategory)}>
                            {defaultText}
                        </Link>

                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={getCategoryHref(category.slug)}
                                className={pillClassName(activeCategory?.slug === category.slug)}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="sticky top-[78px] z-30 mb-6 lg:hidden">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex w-full items-center justify-between rounded-[24px] border border-[#e7dadd] bg-white/95 px-4 py-3 text-left shadow-lg shadow-[#f3e6ea]/80 backdrop-blur transition-all dark:border-white/10 dark:bg-[#1b1416]/95 dark:shadow-black/20"
                >
                    <div className="min-w-0">
                        <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-primary/75">
                                {t("products.browseCategories")}
                            </p>
                            <p className="truncate text-sm font-semibold text-[#22171b] dark:text-white">
                                {activeLabel}
                            </p>
                        </div>
                    </div>

                    <span className="rounded-full bg-[#f8eef1] px-3 py-1 text-xs font-semibold text-[#6f4d57] dark:bg-white/10 dark:text-white/70">
                        {categories.length}
                    </span>
                </button>
            </div>

            <div
                className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
                    isOpen ? "visible" : "invisible"
                }`}
            >
                <button
                    aria-label={t("common.close")}
                    className={`absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300 ${
                        isOpen ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={() => setIsOpen(false)}
                />

                <div
                    className={`absolute inset-x-0 bottom-0 rounded-t-[32px] border-t border-[#eadfe2] bg-[#fff8fa] px-5 pb-8 pt-5 shadow-2xl transition-transform duration-300 dark:border-white/10 dark:bg-[#161012] ${
                        isOpen ? "translate-y-0" : "translate-y-full"
                    }`}
                >
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-primary/75">
                                {t("products.browseCategories")}
                            </p>
                            <h3 className="mt-2 text-2xl font-bold text-[#1f1418] dark:text-white">
                                {activeLabel}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {t("products.browseCategoriesHint")}
                            </p>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadfe2] bg-white text-[#1f1418] transition-colors hover:border-primary/40 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-white"
                        >
                            <MdClose className="text-[22px]" />
                        </button>
                    </div>

                    <div className="relative mb-4">
                        <MdSearch className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-lg text-gray-400 ${dir === "rtl" ? "right-4" : "left-4"}`} />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={t("common.search")}
                            className={`w-full rounded-2xl border border-[#e7dadd] bg-white py-3 text-sm font-medium text-[#2b1d21] outline-none transition focus:border-primary dark:border-white/10 dark:bg-white/5 dark:text-white ${
                                dir === "rtl" ? "pr-11 pl-4" : "pl-11 pr-4"
                            }`}
                        />
                    </div>

                    <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
                        <Link
                            href={defaultHref}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center justify-between rounded-2xl border px-4 py-4 transition-all ${
                                !activeCategory
                                    ? "border-primary bg-primary text-white"
                                    : "border-[#eadfe2] bg-white text-[#2b1d21] hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-white"
                            }`}
                        >
                            <div>
                                <p className="text-sm font-semibold">{defaultText}</p>
                                <p className={`mt-1 text-xs ${!activeCategory ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                                    {t("products.allProductsDescription")}
                                </p>
                            </div>
                            <MdKeyboardArrowRight className={`text-xl ${dir === "rtl" ? "rotate-180" : ""}`} />
                        </Link>

                        {filteredCategories.map((category) => {
                            const isActive = activeCategory?.slug === category.slug;

                            return (
                                <Link
                                    key={category.id}
                                    href={getCategoryHref(category.slug)}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between rounded-2xl border px-4 py-4 transition-all ${
                                        isActive
                                            ? "border-primary bg-primary text-white"
                                            : "border-[#eadfe2] bg-white text-[#2b1d21] hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    }`}
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold">{category.name}</p>
                                        <p className={`mt-1 truncate text-xs ${isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                                            {category.description || t("products.categoryDescriptionFallback")}
                                        </p>
                                    </div>
                                    <MdKeyboardArrowRight className={`shrink-0 text-xl ${dir === "rtl" ? "rotate-180" : ""}`} />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategorySelector;
