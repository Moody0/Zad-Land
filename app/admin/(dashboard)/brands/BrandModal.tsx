"use client";

import { useEffect, useState } from "react";
import { MdClose, MdSync } from "react-icons/md";
import { createBrand, updateBrand } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";
import ImageUploadField from "../../components/ImageUploadField";

interface Brand {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    group?: "MAIN" | "DIFFERENT";
    isActive: boolean;
    isFeatured: boolean;
    mainCategoryId?: string | null;
}

interface MainCategoryOption {
    id: string;
    name: string;
}

interface BrandModalProps {
    isOpen: boolean;
    onClose: () => void;
    brand?: Brand | null;
}

export default function BrandModal({ isOpen, onClose, brand }: BrandModalProps) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mainCategories, setMainCategories] = useState<MainCategoryOption[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        group: "MAIN" as "MAIN" | "DIFFERENT",
        isActive: true,
        isFeatured: false,
        mainCategoryId: "",
    });

    useEffect(() => {
        // Fetch main categories for the dropdown
        fetch("/api/main-categories")
            .then((res) => res.json())
            .then((data) => setMainCategories(data))
            .catch(() => setMainCategories([]));
    }, []);

    useEffect(() => {
        if (brand) {
            setFormData({
                name: brand.name,
                description: brand.description || "",
                image: brand.image || "",
                group: brand.group || "MAIN",
                isActive: brand.isActive,
                isFeatured: brand.isFeatured,
                mainCategoryId: brand.mainCategoryId || "",
            });
        } else {
            setFormData({
                name: "",
                description: "",
                image: "",
                group: "MAIN",
                isActive: true,
                isFeatured: false,
                mainCategoryId: "",
            });
        }
    }, [brand, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                group: "MAIN" as const,
                isFeatured: formData.isFeatured,
                mainCategoryId: formData.mainCategoryId || undefined,
            };
            const result = brand ? await updateBrand(brand.id, payload) : await createBrand(payload);

            if (result.success) {
                toast.success(brand ? t("admin.brandUpdated") : t("admin.brandCreated"));
                onClose();
            } else {
                toast.error(result.error || t("admin.brandSaveError"));
            }
        } catch (error) {
            console.error("Error saving brand:", error);
            toast.error(t("admin.brandSaveError"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />
            <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0f172a] shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 p-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {brand ? t("admin.editBrand") : t("admin.addBrand")}
                    </h2>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <MdClose className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex max-h-[80vh] flex-col gap-5 overflow-y-auto p-6">
                    <label className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400">{t("admin.brandName")} *</span>
                        <input
                            required
                            value={formData.name}
                            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                            placeholder={isArabic ? "مثال: American Garden - اميركان جاردن" : "e.g. American Garden"}
                            className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-[#072835] focus:ring-2 focus:ring-[#072835]/15"
                        />
                    </label>

                    {/* Image Upload Component (Direct PC upload + URL link support) */}
                    <ImageUploadField
                        label={t("admin.imageUrl") || "Brand Logo / Image"}
                        folder="brands"
                        value={formData.image}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        placeholder="https://example.com/brand-logo.png"
                    />

                    <label className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400">
                            {isArabic ? "القسم الرئيسي (Department)" : "Main Category / Department"}
                        </span>
                        <select
                            value={formData.mainCategoryId}
                            onChange={(event) => setFormData({ ...formData, mainCategoryId: event.target.value })}
                            className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-[#072835] focus:ring-2 focus:ring-[#072835]/15 cursor-pointer"
                        >
                            <option value="">-- {isArabic ? "اختر القسم الرئيسي" : "Select Main Category"} --</option>
                            {mainCategories.map((mc) => (
                                <option key={mc.id} value={mc.id}>
                                    {mc.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400">{t("admin.description")}</span>
                        <textarea
                            value={formData.description}
                            onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                            rows={3}
                            placeholder={isArabic ? "نبذة عن الماركة ومنتجاتها..." : "Short description about the brand..."}
                            className="resize-none rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-[#072835] focus:ring-2 focus:ring-[#072835]/15"
                        />
                    </label>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="flex items-center gap-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800/50 p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })}
                                className="size-4 rounded border-gray-300 text-[#072835] focus:ring-[#072835]"
                            />
                            <div>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">{t("admin.active") || "Active"}</span>
                                <span className="text-[11px] text-slate-400 block">{isArabic ? "عرض الماركة في المتجر" : "Visible in store"}</span>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800/50 p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(event) => setFormData({ ...formData, isFeatured: event.target.checked })}
                                className="size-4 rounded border-gray-300 text-[#072835] focus:ring-[#072835]"
                            />
                            <div>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">{t("admin.featured") || "Featured Brand"}</span>
                                <span className="text-[11px] text-slate-400 block">{isArabic ? "إبراز في أعلى القائمة والمقدمة" : "Highlight in top rail & lists"}</span>
                            </div>
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200/80 dark:border-white/10 px-4 py-2.5 font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            {t("admin.cancel")}
                        </button>
                        <button type="submit" disabled={isSubmitting} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#072835] hover:bg-[#0c4054] text-white px-4 py-2.5 font-bold text-sm transition-all disabled:opacity-50">
                            {isSubmitting && <MdSync className="animate-spin text-lg" />}
                            {brand ? t("admin.updateBrand") : t("admin.createBrand")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
