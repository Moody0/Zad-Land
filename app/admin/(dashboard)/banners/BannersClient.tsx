"use client";

import AdminHeader from "../../components/AdminHeader";
import { useAdminSidebar } from "../../context/AdminSidebarContext";
import { useState } from "react";
import { 
    MdAdd, 
    MdSync, 
    MdVisibility, 
    MdVisibilityOff, 
    MdEdit, 
    MdDelete, 
    MdViewCarousel 
} from "react-icons/md";
import BannerModal from "./BannerModal";
import { deleteBanner, toggleBannerStatus } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/app/context/LanguageContext";

interface Banner {
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
    createdAt: string;
    updatedAt: string;
}

export default function BannersClient({ banners }: { banners: Banner[] }) {
    const { data: session } = useSession();
    const { t, dir } = useLanguage();
    const canManage = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canManageBanners;
    const canDelete = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canDeleteBanners;

    const { openSidebar } = useAdminSidebar();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const handleAdd = () => {
        setSelectedBanner(null);
        setIsModalOpen(true);
    };

    const handleEdit = (banner: Banner) => {
        setSelectedBanner(banner);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(t('admin.confirmDeleteBanner').replace('{title}', title))) {
            try {
                const result = await deleteBanner(id);
                if (result.success) {
                    toast.success(t('admin.bannerDeleted'));
                } else {
                    toast.error(result.error || "Failed to delete banner");
                }
            } catch (error) {
                console.error("Error deleting banner:", error);
                toast.error("An unexpected error occurred");
            }
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        setLoadingMap(prev => ({ ...prev, [id]: true }));
        try {
            const result = await toggleBannerStatus(id, !currentStatus);
            if (result.success) {
                toast.success(t('admin.bannerStatusUpdated').replace('{status}', !currentStatus ? t('admin.activated') : t('admin.deactivated')));
            } else {
                toast.error(result.error || "Failed to update status");
            }
        } catch (error) {
            console.error("Error toggling banner status:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setLoadingMap(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader title={t('admin.homeBanners')} onMenuClick={openSidebar} />

            <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-white">
                                {t('admin.heroBanners')}
                            </h3>
                            <p className="text-text-sub dark:text-gray-400 mt-1">
                                {t('admin.controlHero')}
                            </p>
                        </div>
                        {canManage && (
                            <button
                                onClick={handleAdd}
                                className="bg-[#072835] hover:bg-[#0c4054] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                            >
                                <MdAdd className="text-xl" />
                                {t('admin.createNewAd')}
                            </button>
                        )}
                    </div>

                    <BannerModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        banner={selectedBanner}
                    />

                    <div className="grid grid-cols-1 gap-8">
                        {banners.map((banner) => (
                            <div key={banner.id} className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col lg:flex-row">
                                <div className="lg:w-1/3 aspect-21/9 lg:aspect-auto overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img
                                        alt={banner.title || "Banner"}
                                        className="w-full h-full object-cover"
                                        src={banner.image}
                                    />
                                </div>
                                <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-amber-50 text-[#B8860B] border border-amber-200 dark:bg-amber-950/40 dark:text-[#E5B54A] dark:border-amber-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                {banner.badge || t('admin.banner')}
                                            </span>
                                            {!banner.isActive && (
                                                <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                    {t('admin.hidden')}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-text-main dark:text-white mt-1">{banner.title}</h3>
                                        <p className="text-sm text-text-sub dark:text-gray-400 line-clamp-2">
                                            {banner.subtitle || t('admin.noSubtitle')}
                                        </p>
                                        {banner.titleAr && (
                                            <>
                                                <h3 className="text-lg font-bold text-text-main dark:text-white mt-3 text-end" dir="rtl">{banner.titleAr}</h3>
                                                <p className="text-sm text-text-sub dark:text-gray-400 line-clamp-2 text-end" dir="rtl">
                                                    {banner.subtitleAr || t('admin.noSubtitle')}
                                                </p>
                                            </>
                                        )}
                                        <div className="flex gap-4 mt-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-text-sub/60 dark:text-gray-500 font-bold uppercase">{t('admin.button')}</span>
                                                <span className="text-sm font-medium dark:text-gray-300">{banner.buttonText}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-text-sub/60 dark:text-gray-500 font-bold uppercase">{t('admin.link')}</span>
                                                <span className="text-sm font-medium dark:text-gray-300">{banner.link}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-border-color/30 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleToggleStatus(banner.id, banner.isActive)}
                                                disabled={loadingMap[banner.id] || !canManage}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${banner.isActive
                                                    ? 'bg-green-50 text-green-600 dark:bg-green-900/10 dark:text-green-400'
                                                    : 'bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                                                    }`}
                                            >
                                                {loadingMap[banner.id] ? (
                                                    <MdSync className="animate-spin text-[18px]" />
                                                ) : (
                                                    banner.isActive ? <MdVisibility className="text-[18px]" /> : <MdVisibilityOff className="text-[18px]" />
                                                )}
                                                {banner.isActive ? t('admin.active') : t('admin.hidden')}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {canManage && (
                                                <button
                                                    onClick={() => handleEdit(banner)}
                                                    className="p-3 text-text-sub hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/10 rounded-xl transition-colors"
                                                    title={t('admin.editBanner')}
                                                >
                                                    <MdEdit className="text-[22px]" />
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDelete(banner.id, banner.title || "Banner")}
                                                    className="p-3 text-text-sub hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                                                    title={t('admin.deleteBanner')}
                                                >
                                                    <MdDelete className="text-[22px]" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {banners.length === 0 && (
                        <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-2xl border border-dashed border-border-color dark:border-white/[0.04]">
                            <MdViewCarousel className="text-5xl text-text-sub/30 mb-4 mx-auto" />
                            <p className="text-text-sub italic">
                                {t('admin.noBanners')}
                            </p>
                            <button
                                onClick={handleAdd}
                                className="mt-4 text-primary font-bold hover:underline"
                            >
                                {t('admin.addFirstBanner')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
