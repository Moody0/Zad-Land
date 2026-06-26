"use client";

import { useEffect, useState } from "react";
import { MdClose, MdSync } from "react-icons/md";
import { createBrand, updateBrand } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";

interface Brand {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    group: "MAIN" | "DIFFERENT";
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
    const { t } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mainCategories, setMainCategories] = useState<MainCategoryOption[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        group: "DIFFERENT" as "MAIN" | "DIFFERENT",
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
                group: brand.group,
                isActive: brand.isActive,
                isFeatured: brand.isFeatured,
                mainCategoryId: brand.mainCategoryId || "",
            });
        } else {
            setFormData({
                name: "",
                description: "",
                image: "",
                group: "DIFFERENT",
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
                isFeatured: formData.group === "MAIN" ? formData.isFeatured : false,
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
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-black/[0.04] dark:border-white/[0.04] bg-white shadow-2xl dark:border-white/[0.04] dark:bg-surface-dark">
                <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/[0.04] p-6 dark:border-white/[0.04]">
                    <h2 className="text-xl font-bold text-text-main dark:text-white">
                        {brand ? t("admin.editBrand") : t("admin.addBrand")}
                    </h2>
                    <button onClick={onClose} className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                        <MdClose className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex max-h-[80vh] flex-col gap-5 overflow-y-auto p-6">
                    <label className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400">{t("admin.brandName")}</span>
                        <input
                            required
                            value={formData.name}
                            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                            className="rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white px-4 py-3 text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/[0.04] dark:bg-gray-900 dark:text-white"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400">{t("admin.imageUrl")}</span>
                        <input
                            value={formData.image}
                            onChange={(event) => setFormData({ ...formData, image: event.target.value })}
                            placeholder="https://example.com/brand.jpg"
                            className="rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white px-4 py-3 text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/[0.04] dark:bg-gray-900 dark:text-white"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400">Main Category</span>
                        <select
                            value={formData.mainCategoryId}
                            onChange={(event) => setFormData({ ...formData, mainCategoryId: event.target.value })}
                            className="rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white px-4 py-3 text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/[0.04] dark:bg-gray-900 dark:text-white"
                        >
                            <option value="">-- No Main Category --</option>
                            {mainCategories.map((mc) => (
                                <option key={mc.id} value={mc.id}>
                                    {mc.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400">{t("admin.brandGroup")}</span>
                        <select
                            value={formData.group}
                            onChange={(event) => setFormData({ ...formData, group: event.target.value as "MAIN" | "DIFFERENT" })}
                            className="rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white px-4 py-3 text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/[0.04] dark:bg-gray-900 dark:text-white"
                        >
                            <option value="MAIN">{t("brands.mainBrands")}</option>
                            <option value="DIFFERENT">{t("brands.differentBrands")}</option>
                        </select>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400">{t("admin.description")}</span>
                        <textarea
                            value={formData.description}
                            onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                            rows={3}
                            className="resize-none rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white px-4 py-3 text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/[0.04] dark:bg-gray-900 dark:text-white"
                        />
                    </label>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="flex items-center gap-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-background-light p-4 dark:border-white/[0.04] dark:bg-gray-800/50">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })}
                                className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400">{t("admin.active")}</span>
                        </label>
                        <label className={`flex items-center gap-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-background-light p-4 dark:border-white/[0.04] dark:bg-gray-800/50 ${formData.group !== "MAIN" ? "opacity-50" : ""}`}>
                            <input
                                type="checkbox"
                                disabled={formData.group !== "MAIN"}
                                checked={formData.isFeatured}
                                onChange={(event) => setFormData({ ...formData, isFeatured: event.target.checked })}
                                className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400">{t("admin.featured")}</span>
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-black/[0.04] dark:border-white/[0.04] px-4 py-3 font-bold text-text-main transition-colors hover:bg-gray-50 dark:border-white/[0.04] dark:text-white dark:hover:bg-gray-800">
                            {t("admin.cancel")}
                        </button>
                        <button type="submit" disabled={isSubmitting} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-white transition-all hover:bg-primary/90 disabled:opacity-50">
                            {isSubmitting && <MdSync className="animate-spin text-lg" />}
                            {brand ? t("admin.updateBrand") : t("admin.createBrand")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
