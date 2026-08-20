"use client";

import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { createBanner, updateBanner, BannerInput } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";
import ImageUploadField from "../../components/ImageUploadField";

interface BannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    banner?: {
        id: string;
        title: string | null;
        subtitle: string | null;
        titleAr: string | null;
        subtitleAr: string | null;
        image: string;
        buttonText: string | null;
        link: string | null;
        badge: string | null;
        isActive: boolean;
    } | null;
}

export default function BannerModal({ isOpen, onClose, banner }: BannerModalProps) {
    const { t, dir } = useLanguage();
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [titleAr, setTitleAr] = useState("");
    const [subtitleAr, setSubtitleAr] = useState("");
    const [image, setImage] = useState("");
    const [buttonText, setButtonText] = useState("Shop Now");
    const [link, setLink] = useState("/products");
    const [badge, setBadge] = useState("New Collection");
    const [isActive, setIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (banner) {
            setTitle(banner.title || "");
            setSubtitle(banner.subtitle || "");
            setTitleAr(banner.titleAr || "");
            setSubtitleAr(banner.subtitleAr || "");
            setImage(banner.image);
            setButtonText(banner.buttonText || "Shop Now");
            setLink(banner.link || "/products");
            setBadge(banner.badge || "New Collection");
            setIsActive(banner.isActive);
        } else {
            setTitle("");
            setSubtitle("");
            setTitleAr("");
            setSubtitleAr("");
            setImage("");
            setButtonText("Shop Now");
            setLink("/products");
            setBadge("New Collection");
            setIsActive(true);
        }
    }, [banner, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data: BannerInput = {
                title,
                subtitle: subtitle || undefined,
                titleAr,
                subtitleAr: subtitleAr || undefined,
                image,
                buttonText: buttonText || undefined,
                link: link || undefined,
                badge: badge || undefined,
                isActive
            };

            let result;

            if (banner) {
                result = await updateBanner(banner.id, data);
            } else {
                result = await createBanner(data);
            }

            if (result.success) {
                toast.success(banner ? t('admin.bannerUpdated') : t('admin.bannerCreated'));
                onClose();
            } else {
                toast.error(result.error || `Failed to ${banner ? "update" : "create"} banner`);
            }
        } catch (error) {
            console.error("Error submitting banner:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden border border-black/[0.04] dark:border-white/[0.04]">
                <div className="p-6 border-b border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between">
                    <h2 className="text-xl font-bold text-text-main dark:text-white">
                        {banner ? t('admin.editBanner') : t('admin.addNewBanner')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <MdClose className="text-gray-500 text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className={`text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'me-1' : 'ms-1'}`}>
                                {t('admin.badge')}
                            </label>
                            <input
                                type="text"
                                value={badge}
                                onChange={(e) => setBadge(e.target.value)}
                                placeholder="e.g. New Collection"
                                className="w-full px-4 py-2.5 rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            />

                        </div>
                        <div className="flex flex-col gap-2">
                            <label className={`text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'me-1' : 'ms-1'}`}>
                                {t('admin.status')}
                            </label>
                            <div className="flex items-center gap-3 h-[46px]">
                                <button
                                    type="button"
                                    onClick={() => setIsActive(!isActive)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                                >
                                    <span
                                        className={`${isActive ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') : (dir === 'rtl' ? '-translate-x-1' : 'translate-x-1')} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                    />
                                </button>
                                <span className="text-sm text-text-sub dark:text-gray-400">
                                    {isActive ? t('admin.active') : t('admin.hidden')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={`text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'me-1' : 'ms-1'}`}>
                            {t('admin.title')} (English)
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Radiance Redefined"
                            className="w-full px-4 py-2.5 rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={`text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'me-1' : 'ms-1'}`}>
                            {t('admin.subtitle')} (English)
                        </label>
                        <textarea
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder="Discover our premium goods from top global brands..."
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={`text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'me-1' : 'ms-1'}`}>
                            {t('admin.title')} (العربية)
                        </label>
                        <input
                            type="text"
                            value={titleAr}
                            onChange={(e) => setTitleAr(e.target.value)}
                            placeholder="مثال: إشراقة معاد تعريفها"
                            className="w-full px-4 py-2.5 rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            dir="rtl"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={`text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'me-1' : 'ms-1'}`}>
                            {t('admin.subtitle')} (العربية)
                        </label>
                        <textarea
                            value={subtitleAr}
                            onChange={(e) => setSubtitleAr(e.target.value)}
                            placeholder="اكتشف مجموعتنا النباتية الجديدة..."
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                            dir="rtl"
                        />
                    </div>

                    <ImageUploadField
                        label={t('admin.imageUrl') || "Banner Image"}
                        folder="banners"
                        value={image}
                        onChange={(url) => setImage(url)}
                        placeholder="https://example.com/banner.jpg"
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className={`text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'me-1' : 'ms-1'}`}>
                                {t('admin.buttonText')}
                            </label>
                            <input
                                type="text"
                                value={buttonText}
                                onChange={(e) => setButtonText(e.target.value)}
                                placeholder="e.g. Shop Now"
                                className="w-full px-4 py-2.5 rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className={`text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'me-1' : 'ms-1'}`}>
                                {t('admin.linkUrl')}
                            </label>
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="e.g. /products"
                                className="w-full px-4 py-2.5 rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] text-text-main dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            {t('admin.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-2 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                                    {t('admin.saving')}
                                </>
                            ) : (
                                banner ? t('admin.updateBanner') : t('admin.createBanner')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
