"use client";

import { useMemo, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { useAdminSidebar } from "../../context/AdminSidebarContext";
import BrandModal from "./BrandModal";
import { deleteBrand, toggleBrandActive, toggleBrandFeatured } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdAdd, MdDelete, MdEdit, MdImage, MdSearch, MdStar, MdStarBorder, MdSync, MdToggleOff, MdToggleOn } from "react-icons/md";
import RelatedItemsModal from "../components/RelatedItemsModal";

interface Brand {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    group: "MAIN" | "DIFFERENT";
    isActive: boolean;
    isFeatured: boolean;
    mainCategoryId?: string | null;
    _count: {
        products: number;
        categories: number;
    };
}

export default function BrandsClient({ brands }: { brands: Brand[] }) {
    const { openSidebar } = useAdminSidebar();
    const { data: session } = useSession();
    const { t } = useLanguage();
    const canManage = session?.user?.role === "SUPER_ADMIN" || session?.user?.canManageBrands;
    const canDelete = session?.user?.role === "SUPER_ADMIN" || session?.user?.canDeleteBrands;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [groupFilter, setGroupFilter] = useState("ALL");
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const [relatedModalInfo, setRelatedModalInfo] = useState<{
        isOpen: boolean;
        type: "products" | "categories";
        entityId: string;
        entityName: string;
    }>({
        isOpen: false,
        type: "products",
        entityId: "",
        entityName: ""
    });

    const filteredBrands = useMemo(() => {
        return brands.filter((brand) => {
            const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (brand.description || "").toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGroup = groupFilter === "ALL" || brand.group === groupFilter;
            return matchesSearch && matchesGroup;
        });
    }, [brands, searchQuery, groupFilter]);

    const handleAdd = () => {
        setSelectedBrand(null);
        setIsModalOpen(true);
    };

    const handleEdit = (brand: Brand) => {
        setSelectedBrand(brand);
        setIsModalOpen(true);
    };

    const handleDelete = async (brand: Brand) => {
        if (!confirm(t("admin.confirmDeleteBrand").replace("{name}", brand.name))) return;

        const result = await deleteBrand(brand.id);
        if (result.success) {
            toast.success(t("admin.brandDeleted"));
        } else {
            toast.error(t(`admin.${result.error}`) || result.error || t("admin.deleteBrandError"));
        }
    };

    const handleToggleActive = async (brand: Brand) => {
        setLoadingMap((current) => ({ ...current, [`active:${brand.id}`]: true }));
        const result = await toggleBrandActive(brand.id, !brand.isActive);
        if (result.success) toast.success(t("admin.brandUpdated"));
        else toast.error(result.error || t("admin.brandSaveError"));
        setLoadingMap((current) => ({ ...current, [`active:${brand.id}`]: false }));
    };

    const handleToggleFeatured = async (brand: Brand) => {
        if (brand.group !== "MAIN") return;
        setLoadingMap((current) => ({ ...current, [`featured:${brand.id}`]: true }));
        const result = await toggleBrandFeatured(brand.id, !brand.isFeatured);
        if (result.success) toast.success(t("admin.brandUpdated"));
        else toast.error(result.error || t("admin.brandSaveError"));
        setLoadingMap((current) => ({ ...current, [`featured:${brand.id}`]: false }));
    };

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <AdminHeader title={t("admin.brands")} onMenuClick={openSidebar} />

            <div className="flex-1 overflow-y-auto bg-[#fafafa] dark:bg-[#111111] p-6 md:p-10">
                <div className="mx-auto max-w-[1400px]">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-white">{t("admin.brandManagement")}</h2>
                            <p className="mt-1 text-text-sub dark:text-gray-400">{t("admin.manageBrands")}</p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative">
                                <MdSearch className="absolute start-3 top-1/2 -translate-y-1/2 text-xl text-text-sub/60" />
                                <input
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder={t("admin.searchBrands")}
                                    className="h-11 w-full rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-surface-dark ps-10 pe-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-white/[0.04] dark:bg-surface-dark dark:text-white sm:w-64"
                                />
                            </div>
                            <select
                                value={groupFilter}
                                onChange={(event) => setGroupFilter(event.target.value)}
                                className="h-11 rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white px-4 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-white/[0.04] dark:bg-surface-dark dark:text-white"
                            >
                                <option value="ALL">{t("admin.allBrands")}</option>
                                <option value="MAIN">{t("brands.mainBrands")}</option>
                                <option value="DIFFERENT">{t("brands.differentBrands")}</option>
                            </select>
                            {canManage && (
                                <button onClick={handleAdd} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition-colors hover:bg-primary/90">
                                    <MdAdd className="text-xl" />
                                    {t("admin.addBrand")}
                                </button>
                            )}
                        </div>
                    </div>

                    <BrandModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        brand={selectedBrand}
                    />

                    <RelatedItemsModal
                        isOpen={relatedModalInfo.isOpen}
                        onClose={() => setRelatedModalInfo(prev => ({ ...prev, isOpen: false }))}
                        type={relatedModalInfo.type}
                        entityType="brandId"
                        entityId={relatedModalInfo.entityId}
                        entityName={relatedModalInfo.entityName}
                    />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredBrands.map((brand) => (
                            <article key={brand.id} className="overflow-hidden rounded-2xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-surface-dark shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)]">
                                <div className="flex h-36 items-center justify-center bg-gray-50 dark:bg-gray-800">
                                    {brand.image ? (
                                        <img src={brand.image} alt={brand.name} className="h-full w-full object-contain" />
                                    ) : (
                                        <MdImage className="text-5xl text-text-sub/30" />
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="truncate text-lg font-bold text-text-main dark:text-white">{brand.name}</h3>
                                            <p className="text-xs font-bold uppercase tracking-wider text-primary">{brand.group}</p>
                                        </div>
                                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${brand.isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>
                                            {brand.isActive ? t("admin.active") : t("admin.draft")}
                                        </span>
                                    </div>

                                    <p className="mb-4 line-clamp-2 min-h-[40px] text-sm text-text-sub dark:text-gray-400">
                                        {brand.description || t("admin.noDescription")}
                                    </p>

                                    <div className="mb-4 flex gap-2 text-xs font-bold text-text-sub dark:text-gray-400">
                                        <button 
                                            onClick={() => setRelatedModalInfo({ isOpen: true, type: "products", entityId: brand.id, entityName: brand.name })}
                                            className="cursor-pointer rounded-full bg-primary/10 px-3 py-1 text-primary hover:bg-primary/20 transition-colors"
                                        >
                                            {brand._count.products} {t("admin.products")}
                                        </button>
                                        <button 
                                            onClick={() => setRelatedModalInfo({ isOpen: true, type: "categories", entityId: brand.id, entityName: brand.name })}
                                            className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {brand._count.categories} {t("admin.categories")}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] dark:border-white/[0.04] pt-4 dark:border-white/[0.04]">
                                        {canManage && (
                                            <button onClick={() => handleToggleActive(brand)} className="rounded-lg p-2 text-text-sub transition-colors hover:bg-primary/10 hover:text-primary" title={t("admin.active")}>
                                                {loadingMap[`active:${brand.id}`] ? <MdSync className="animate-spin text-xl" /> : brand.isActive ? <MdToggleOn className="text-2xl text-emerald-500" /> : <MdToggleOff className="text-2xl" />}
                                            </button>
                                        )}
                                        {canManage && brand.group === "MAIN" && (
                                            <button onClick={() => handleToggleFeatured(brand)} className="rounded-lg p-2 text-text-sub transition-colors hover:bg-amber-50 hover:text-amber-500 dark:hover:bg-amber-900/10" title={t("admin.featured")}>
                                                {loadingMap[`featured:${brand.id}`] ? <MdSync className="animate-spin text-xl" /> : brand.isFeatured ? <MdStar className="text-xl text-amber-500" /> : <MdStarBorder className="text-xl" />}
                                            </button>
                                        )}
                                        {canManage && (
                                            <button onClick={() => handleEdit(brand)} className="rounded-lg p-2 text-text-sub transition-colors hover:bg-primary/10 hover:text-primary" title={t("admin.editBrand")}>
                                                <MdEdit className="text-xl" />
                                            </button>
                                        )}
                                        {canDelete && (
                                            <button onClick={() => handleDelete(brand)} className="rounded-lg p-2 text-text-sub transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10" title={t("admin.deleteBrand")}>
                                                <MdDelete className="text-xl" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
