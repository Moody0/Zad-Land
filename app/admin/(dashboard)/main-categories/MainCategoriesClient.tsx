"use client";

import { useMemo, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { useAdminSidebar } from "../../context/AdminSidebarContext";
import MainCategoryModal from "./MainCategoryModal";
import { deleteMainCategory, toggleMainCategoryActive } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdAdd, MdDelete, MdEdit, MdImage, MdSearch, MdSync, MdToggleOff, MdToggleOn } from "react-icons/md";
import RelatedItemsModal from "../components/RelatedItemsModal";

interface MainCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    isActive: boolean;
    isFeatured: boolean;
    showInNav: boolean;
    navOrder: number;
    _count: {
        brands: number;
        categories: number;
        products: number;
    };
}

export default function MainCategoriesClient({ mainCategories }: { mainCategories: MainCategory[] }) {
    const { openSidebar } = useAdminSidebar();
    const { data: session } = useSession();
    const { t, dir } = useLanguage();
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selected, setSelected] = useState<MainCategory | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const [relatedModalInfo, setRelatedModalInfo] = useState<{
        isOpen: boolean;
        type: "products" | "categories" | "brands";
        entityId: string;
        entityName: string;
    }>({
        isOpen: false,
        type: "products",
        entityId: "",
        entityName: ""
    });

    const filtered = useMemo(() => {
        return mainCategories.filter((mc) =>
            mc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (mc.description || "").toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [mainCategories, searchQuery]);

    const handleAdd = () => {
        setSelected(null);
        setIsModalOpen(true);
    };

    const handleEdit = (mc: MainCategory) => {
        setSelected(mc);
        setIsModalOpen(true);
    };

    const handleDelete = async (mc: MainCategory) => {
        if (!confirm(`Are you sure you want to delete "${mc.name}"?`)) return;
        const result = await deleteMainCategory(mc.id);
        if (result.success) {
            toast.success(t("admin.mainCategoryDeleted") || "Deleted");
        } else {
            toast.error(result.error || "Failed to delete");
        }
    };

    const handleToggleActive = async (mc: MainCategory) => {
        setLoadingMap((c) => ({ ...c, [mc.id]: true }));
        const result = await toggleMainCategoryActive(mc.id, !mc.isActive);
        if (result.success) toast.success(t("admin.mainCategoryUpdated") || "Updated");
        else toast.error(result.error || "Failed to update");
        setLoadingMap((c) => ({ ...c, [mc.id]: false }));
    };

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <AdminHeader title={t("admin.mainCategories")} onMenuClick={openSidebar} />

            <div className="flex-1 overflow-y-auto bg-[#fafafa] dark:bg-[#111111] p-6 md:p-10">
                <div className="mx-auto max-w-[1400px]">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-white">{t("admin.mainCategories")}</h2>
                            <p className="mt-1 text-text-sub dark:text-gray-400">{t("admin.manageMainCategories")}</p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative">
                                <MdSearch className="absolute start-3 top-1/2 -translate-y-1/2 text-xl text-text-sub/60" />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t("common.searchProducts") || t("common.search") || "Search..."}
                                    className="h-11 w-full rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-surface-dark ps-10 pe-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-white/[0.04] dark:bg-surface-dark dark:text-white sm:w-64"
                                />
                            </div>
                            {isSuperAdmin && (
                                <button onClick={handleAdd} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#072835] hover:bg-[#0c4054] px-5 text-sm font-bold text-white transition-all shadow-xs">
                                    <MdAdd className="text-xl" />{t("admin.addMainCategory")}</button>
                            )}
                        </div>
                    </div>

                    <MainCategoryModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        mainCategory={selected}
                    />

                    <RelatedItemsModal
                        isOpen={relatedModalInfo.isOpen}
                        onClose={() => setRelatedModalInfo(prev => ({ ...prev, isOpen: false }))}
                        type={relatedModalInfo.type}
                        entityType="mainCategoryId"
                        entityId={relatedModalInfo.entityId}
                        entityName={relatedModalInfo.entityName}
                    />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filtered.map((mc) => (
                            <article key={mc.id} className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0f172a] shadow-xs transition-all duration-300 hover:shadow-md">
                                <div className="flex h-36 items-center justify-center bg-gray-50 dark:bg-gray-800">
                                    {mc.image ? (
                                        <img src={mc.image} alt={mc.name} className="h-full w-full object-contain" />
                                    ) : (
                                        <MdImage className="text-5xl text-text-sub/30" />
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="truncate text-lg font-bold text-text-main dark:text-white">{mc.name}</h3>
                                            <p className="text-xs font-bold uppercase tracking-wider text-[#072835] dark:text-[#E5B54A]">{mc.slug}</p>
                                        </div>
                                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${mc.isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>
                                            {mc.isActive ? t("admin.active") : t("admin.draft")}
                                        </span>
                                    </div>

                                    <p className="mb-4 line-clamp-2 min-h-[40px] text-sm text-text-sub dark:text-gray-400">
                                        {mc.description || t("admin.noDescription")}
                                    </p>

                                    <div className="mb-4 flex flex-wrap gap-2 text-xs font-bold text-text-sub dark:text-gray-400">
                                        <button 
                                            onClick={() => setRelatedModalInfo({ isOpen: true, type: "brands", entityId: mc.id, entityName: mc.name })}
                                            className="cursor-pointer rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            {mc._count.brands} Brands
                                        </button>
                                        <button 
                                            onClick={() => setRelatedModalInfo({ isOpen: true, type: "categories", entityId: mc.id, entityName: mc.name })}
                                            className="cursor-pointer rounded-full bg-blue-50 px-3 py-1 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                        >
                                            {mc._count.categories} Categories
                                        </button>
                                        <button 
                                            onClick={() => setRelatedModalInfo({ isOpen: true, type: "products", entityId: mc.id, entityName: mc.name })}
                                            className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {mc._count.products} Products
                                        </button>
                                        {mc.showInNav && (
                                            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300">
                                                Navbar: #{mc.navOrder}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] dark:border-white/[0.04] pt-4 dark:border-white/[0.04]">
                                        {isSuperAdmin && (
                                            <button onClick={() => handleToggleActive(mc)} className="rounded-lg p-2 text-text-sub transition-colors hover:bg-primary/10 hover:text-primary" title={t("admin.toggleActive")}>
                                                {loadingMap[mc.id] ? <MdSync className="animate-spin text-xl" /> : mc.isActive ? <MdToggleOn className="text-2xl text-emerald-500" /> : <MdToggleOff className="text-2xl" />}
                                            </button>
                                        )}
                                        {isSuperAdmin && (
                                            <button onClick={() => handleEdit(mc)} className="rounded-lg p-2 text-text-sub transition-colors hover:bg-primary/10 hover:text-primary" title={t("admin.edit") || "Edit"}>
                                                <MdEdit className="text-xl" />
                                            </button>
                                        )}
                                        {isSuperAdmin && (
                                            <button onClick={() => handleDelete(mc)} className="rounded-lg p-2 text-text-sub transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10" title={t("admin.delete") || "Delete"}>
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
