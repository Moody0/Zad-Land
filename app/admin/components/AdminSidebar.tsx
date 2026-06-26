"use client";

import Link from "next/link";
import { 
    MdDashboard, 
    MdShoppingBag, 
    MdStorefront,
    MdCategory, 
    MdViewCarousel, 
    MdInventory2, 
    MdLocalOffer, 
    MdEditNote, 
    MdGroup, 
    MdSettings,
    MdClose,
    MdLogout,
    MdAccountTree,
    MdStar
} from "react-icons/md";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/app/context/LanguageContext";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

type PermissionKey =
    | "canManageBrands"
    | "canManageProducts"
    | "canManageCategories"
    | "canManageBanners"
    | "canManageOrders"
    | "canManagePromoCodes"
    | "canManageReviews";

interface NavItem {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    permission?: PermissionKey;
    superAdminOnly?: boolean;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { t, dir } = useLanguage();
    const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';

    const navItems: NavItem[] = [
        { href: "/admin/dashboard", icon: MdDashboard, label: t('admin.dashboard') },
        { href: "/admin/main-categories", icon: MdAccountTree, label: t("admin.mainCategories"), superAdminOnly: true },
        { href: "/admin/brands", icon: MdStorefront, label: t('admin.brands'), permission: "canManageBrands" },
        { href: "/admin/products", icon: MdShoppingBag, label: t('admin.products'), permission: "canManageProducts" },
        { href: "/admin/categories", icon: MdCategory, label: t('admin.categories'), permission: "canManageCategories" },
        { href: "/admin/banners", icon: MdViewCarousel, label: t('admin.banners'), permission: "canManageBanners" },
        { href: "/admin/orders", icon: MdInventory2, label: t('admin.orders'), permission: "canManageOrders" },
        { href: "/admin/promocodes", icon: MdLocalOffer, label: t('admin.promoCodes'), permission: "canManagePromoCodes" },
        { href: "/admin/reviews", icon: MdStar, label: t('admin.reviews'), permission: "canManageReviews" },
        { href: "/admin/site-content", icon: MdEditNote, label: t('admin.siteContent'), superAdminOnly: true },
        { href: "/admin/users", icon: MdGroup, label: t('admin.users'), superAdminOnly: true },
        { href: "/admin/settings", icon: MdSettings, label: t('admin.settings'), superAdminOnly: true },
    ];

    const handleSignOut = () => {
        signOut({ callbackUrl: "/admin/login" });
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 ${dir === 'rtl' ? 'end-0 border-s' : 'start-0 border-e'} z-50 w-[260px] shrink-0 border-black/[0.04] dark:border-white/[0.04] bg-surface-light dark:bg-surface-dark flex flex-col transition-transform duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none ${isOpen ? "translate-x-0" : (dir === 'rtl' ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0")
                    }`}
            >
                <div className="h-full flex flex-col justify-between py-6 px-4 overflow-y-auto scrollbar-hide">
                    <div className="flex flex-col gap-8">
                        {/* Logo & Brand */}
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/Ruby-Beauty-Logo.jpeg"
                                    alt="Ruby Beauty"
                                    className="h-9 w-auto object-contain rounded-md shadow-sm"
                                />
                                <div className="flex flex-col">
                                    <h1 className="text-text-main dark:text-white text-base font-bold tracking-tight">
                                        {t('header.brandName')}
                                    </h1>
                                    <p className="text-text-sub/70 dark:text-gray-500 text-[10px] uppercase tracking-wider font-semibold">
                                        {t('admin.adminPanel')}
                                    </p>
                                </div>
                            </div>
                            {/* Close button for mobile */}
                            <button
                                onClick={onClose}
                                className="lg:hidden text-text-sub dark:text-gray-400 hover:text-text-main dark:hover:text-white transition-colors"
                            >
                                <MdClose className="text-2xl" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item) => {
                                if (item.superAdminOnly && !isSuperAdmin) return null;
                                if (item.permission && !isSuperAdmin && !session?.user?.[item.permission]) {
                                    return null;
                                }

                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                            ? "bg-gray-50 dark:bg-gray-800/60 text-text-main dark:text-white font-semibold"
                                            : "text-text-sub dark:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 hover:text-text-main dark:hover:text-gray-200"
                                            }`}
                                    >
                                        {isActive && (
                                            <div className={`absolute ${dir === 'rtl' ? 'end-0 rounded-s-full' : 'start-0 rounded-e-full'} top-1/2 -translate-y-1/2 w-1 h-5 bg-primary`} />
                                        )}
                                        <item.icon
                                            className={`text-[20px] transition-colors ${isActive ? "text-primary" : "group-hover:text-text-main dark:group-hover:text-gray-300"}`}
                                        />
                                        <p className="text-[13px] leading-tight tracking-wide">
                                            {item.label}
                                        </p>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex flex-col gap-2 pt-6 mt-6 border-t border-black/[0.04] dark:border-white/[0.04]">
                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                {session?.user?.name?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <div className="flex flex-col">
                                <p className="text-text-main dark:text-white text-[13px] font-semibold leading-tight">
                                    {session?.user?.name || "Admin"}
                                </p>
                                <p className="text-text-sub dark:text-gray-500 text-[11px] font-medium">
                                    {isSuperAdmin ? t('admin.superAdmin') : t('admin.editor')}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub dark:text-gray-400 hover:bg-red-50/50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
                        >
                            <MdLogout className={`text-[20px] group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                            <p className="text-[13px] font-medium leading-tight">{t('admin.signOut')}</p>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
