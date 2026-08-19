"use client";

import AdminHeader from "../../components/AdminHeader";
import { useAdminSidebar } from "../../context/AdminSidebarContext";
import { useState } from "react";
import { 
    MdDelete, 
    MdCheckBox, 
    MdCheckBoxOutlineBlank, 
    MdSearch, 
    MdAdd, 
    MdCheck, 
    MdImage, 
    MdStar, 
    MdStarBorder, 
    MdEdit,
    MdSearchOff,
    MdSync
} from "react-icons/md";
import CategoryModal from "./CategoryModal";
import { deleteCategory, toggleCategoryFeatured, bulkFixCategoryNames, bulkDeleteCategories } from "../../../../lib/admin-actions";
import RelatedItemsModal from "../components/RelatedItemsModal";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/app/context/LanguageContext";

interface Category {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    brandId: string;
    brand: {
        id: string;
        name: string;
        slug: string;
        group: string;
    } | null;
    isFeatured: boolean;
    _count: {
        products: number;
    };
}

interface Brand {
    id: string;
    name: string;
    slug: string;
    group: string;
    isActive: boolean;
}

export default function CategoriesClient({ categories, brands }: { categories: Category[], brands: Brand[] }) {
    const { data: session } = useSession();
    const { t, dir } = useLanguage();
    const canManage = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canManageCategories;
    const canDelete = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canDeleteCategories;

    const { openSidebar } = useAdminSidebar();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("ALL");
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

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredCategories.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredCategories.map(c => c.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        const ids = Array.from(selectedIds);
        
        if (!confirm(`Are you sure you want to delete ${ids.length} categories? This action cannot be undone.`)) {
            return;
        }

        setIsSubmittingBulk(true);
        try {
            const result = await bulkDeleteCategories(ids);
            if (result.success) {
                if (result.partial) {
                    toast(t('admin.bulkDeleteCategoriesPartial')
                        .replace('{count}', result.count?.toString() || '0')
                        .replace('{names}', result.names || ''), 
                        { icon: '⚠️', duration: 6000 }
                    );
                } else {
                    toast.success(t('admin.bulkDeleteCategoriesSuccess').replace('{count}', result.count?.toString() || '0'));
                }
                setSelectedIds(new Set());
            } else {
                toast.error(t(`admin.${result.error}`) || t('admin.bulkDeleteCategoriesError'));
            }
        } catch (error) {
            console.error("Error in bulk delete:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmittingBulk(false);
        }
    };

    const [isFixing, setIsFixing] = useState(false);

    const handleFixGarbledNames = async () => {
        const garbled = categories.filter(c => /[^\x00-\x7F]/.test(c.name));
        if (garbled.length === 0) {
            toast.success("No garbled names found!");
            return;
        }

        if (!confirm(`Found ${garbled.length} categories with encoding issues. Fix them?`)) return;

        setIsFixing(true);
        try {
            const mapping = garbled.map(c => {
                let fixedName = c.name;
                try {
                    fixedName = Buffer.from(c.name, 'binary').toString('utf8');
                } catch (e) {}
                return { id: c.id, newName: fixedName };
            }).filter(item => item.newName !== categories.find(c => c.id === item.id)?.name);

            if (mapping.length === 0) {
                toast.success("No names could be automatically fixed.");
                return;
            }

            const result = await bulkFixCategoryNames(mapping);
            if (result.success) {
                toast.success(`Fixed ${mapping.length} category names!`);
            } else {
                toast.error("Failed to fix names.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during cleanup.");
        } finally {
            setIsFixing(false);
        }
    };

    const filteredCategories = categories.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (category.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
            (category.brand?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
        const matchesBrand = selectedBrand === "ALL" || category.brandId === selectedBrand;
        return matchesSearch && matchesBrand;
    });

    const handleAdd = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(t('admin.confirmDeleteCategory').replace('{name}', name))) {
            try {
                const result = await deleteCategory(id);
                if (result.success) {
                    toast.success(t('admin.categoryDeleted'));
                } else {
                    toast.error(t(`admin.${result.error}`) || t('admin.deleteCategoryError'));
                }
            } catch (error) {
                console.error("Error deleting category:", error);
                toast.error("An unexpected error occurred");
            }
        }
    };

    const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
        setLoadingMap(prev => ({ ...prev, [id]: true }));
        try {
            const result = await toggleCategoryFeatured(id, !currentStatus);
            if (result.success) {
                toast.success(!currentStatus ? t('admin.categoryFeatured') : t('admin.categoryUnfeatured'));
            } else {
                toast.error(result.error || "Failed to update status");
            }
        } catch (error) {
            console.error("Error toggling category featured status:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setLoadingMap(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader title={t('admin.categories')} onMenuClick={openSidebar} />

            <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                        <div className="">
                            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-white">
                                {t('admin.productCategories')}
                            </h3>
                            <p className="text-text-sub dark:text-gray-400 mt-1">
                                {t('admin.manageCategories')}
                            </p>
                        </div>
                        <div className="w-full md:w-auto flex flex-col md:flex-row flex-wrap gap-4 items-center justify-end">
                            {/* Selection Info and Actions */}
                            {selectedIds.size > 0 && (
                                <div className={`flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300 ${dir === 'rtl' ? 'ms-2' : 'me-2'}`}>
                                    <span className="text-sm font-medium text-text-sub dark:text-gray-400 whitespace-nowrap">
                                        {selectedIds.size} {t('admin.selected')}
                                    </span>
                                    {canDelete && (
                                        <button
                                            onClick={handleBulkDelete}
                                            disabled={isSubmittingBulk}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-red-500/20 disabled:opacity-50 whitespace-nowrap"
                                        >
                                            {isSubmittingBulk ? (
                                                <MdSync className="animate-spin text-[18px]" />
                                            ) : (
                                                <MdDelete className="text-[18px]" />
                                            )}
                                            {t('admin.deleteSelected')}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Select All Toggle */}
                            {filteredCategories.length > 0 && (
                                <button
                                    onClick={toggleSelectAll}
                                    className="flex items-center gap-2 px-4 py-2 bg-surface-light dark:bg-surface-dark border border-border-color/50 dark:border-white/[0.04] rounded-lg text-xs font-bold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all whitespace-nowrap"
                                >
                                    {selectedIds.size === filteredCategories.length ? (
                                        <MdCheckBox className="text-[18px]" />
                                    ) : (
                                        <MdCheckBoxOutlineBlank className="text-[18px]" />
                                    )}
                                    {selectedIds.size === filteredCategories.length ? t('admin.deselectAll') : t('admin.selectAll')}
                                </button>
                            )}

                            {/* Featured Count Indicator */}
                            <div className={`hidden md:flex flex-col items-end ${dir === 'rtl' ? 'ms-2' : 'me-2'} whitespace-nowrap`}>
                                <span className="text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400">{t('admin.featured')}</span>
                                <span className="text-sm font-bold text-primary">
                                    {categories.filter(c => c.isFeatured).length} / 8 {t('admin.active')}
                                </span>
                            </div>

                            <div className="relative w-full md:w-64">
                                <MdSearch className={`absolute ${dir === 'rtl' ? 'end-3' : 'start-3'} top-1/2 -translate-y-1/2 text-text-sub/50 dark:text-gray-400/50 text-xl`} />
                                <input
                                    type="text"
                                    placeholder={t('admin.searchCategories')}
                                    className={`w-full ${dir === 'rtl' ? 'pe-10 ps-4' : 'ps-10 pe-4'} py-3 bg-surface-light dark:bg-surface-dark border border-border-color/50 dark:border-white/[0.04] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-main dark:text-white`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="w-full md:w-52 px-4 py-3 bg-surface-light dark:bg-surface-dark border border-border-color/50 dark:border-white/[0.04] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-main dark:text-white"
                            >
                                <option value="ALL">{t('admin.allBrands')}</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                                ))}
                            </select>
                            {canManage && (
                                <button
                                    onClick={handleAdd}
                                    className="w-full md:w-auto bg-[#072835] hover:bg-[#0c4054] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    <MdAdd className="text-xl" />
                                    {t('admin.addCategory')}
                                </button>
                            )}
                        </div>
                    </div>

                    <CategoryModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        category={selectedCategory}
                        brands={brands}
                    />

                    <RelatedItemsModal
                        isOpen={relatedModalInfo.isOpen}
                        onClose={() => setRelatedModalInfo(prev => ({ ...prev, isOpen: false }))}
                        type={relatedModalInfo.type}
                        entityType="categoryId"
                        entityId={relatedModalInfo.entityId}
                        entityName={relatedModalInfo.entityName}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCategories.map((category) => (
                            <div 
                                key={category.id} 
                                className={`bg-surface-light dark:bg-surface-dark rounded-xl border ${selectedIds.has(category.id) ? 'border-[#072835]' : 'border-slate-200/80 dark:border-white/10 shadow-xs'} hover:shadow-md transition-all overflow-hidden group relative`}
                            >
                                {/* Selection Checkbox */}
                                <button
                                    onClick={() => toggleSelect(category.id)}
                                    className={`absolute top-4 start-4 z-10 w-6 h-6 rounded-md border flex items-center justify-center transition-all ${selectedIds.has(category.id) ? 'bg-[#072835] border-[#072835] text-white' : 'bg-white/80 dark:bg-black/20 border-white/50 text-transparent hover:border-[#072835]'}`}
                                >
                                    <MdCheck className="text-[18px]" />
                                </button>

                                <div className="category-card-image w-full h-[200px] overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    {category.image ? (
                                        <img
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            src={category.image}
                                        />
                                    ) : (
                                        <MdImage className="text-4xl text-text-sub/40" />
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">{category.name}</h3>
                                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#072835] dark:text-[#E5B54A]">
                                        {category.brand?.name || 'Zad Land'}
                                    </p>
                                    <p className="text-sm text-text-sub dark:text-gray-400 line-clamp-2 mb-4">
                                        {category.description || t('admin.noDescription')}
                                    </p>
                                    <div className="w-full flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                                        <button 
                                            onClick={() => setRelatedModalInfo({ isOpen: true, type: "products", entityId: category.id, entityName: category.name })}
                                            className="cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-full text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            {category._count.products} {t('admin.products')}
                                        </button>
                                        <div className="flex items-center flex-wrap justify-end gap-2">
                                            {canManage && (
                                                <button
                                                    onClick={() => handleToggleFeatured(category.id, category.isFeatured)}
                                                    disabled={loadingMap[category.id]}
                                                    className={`p-2 rounded-lg transition-colors ${category.isFeatured ? 'text-amber-500 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/10 dark:hover:bg-amber-900/20' : 'text-gray-400 hover:text-amber-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                                    title={category.isFeatured ? t('admin.removeFromHome') : t('admin.featureOnHome')}
                                                >
                                                    {loadingMap[category.id] ? (
                                                        <MdSync className="animate-spin text-[20px]" />
                                                    ) : (
                                                        category.isFeatured ? <MdStar className="text-[20px]" /> : <MdStarBorder className="text-[20px]" />
                                                    )}
                                                </button>
                                            )}
                                            {canManage && (
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 text-text-sub hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/10 rounded-lg transition-colors"
                                                    title={t('admin.editCategory')}
                                                >
                                                    <MdEdit className="text-[20px]" />
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDelete(category.id, category.name)}
                                                    className="p-2 text-text-sub hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                                                    title={t('admin.deleteCategory')}
                                                >
                                                    <MdDelete className="text-[20px]" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-2xl border border-dashed border-border-color dark:border-white/[0.04]">
                            <MdSearchOff className="text-5xl text-text-sub/30 mb-4 mx-auto" />
                            <p className="text-text-sub italic">
                                {searchQuery ? t('admin.noCategoriesFound') : t('admin.noCategoriesCreated')}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={handleAdd}
                                    className="mt-4 text-primary font-bold hover:underline"
                                >
                                    {t('admin.createFirstCategory')}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
