"use client";

import AdminHeader from "../../components/AdminHeader";
import Link from "next/link";
import { useAdminSidebar } from "../../context/AdminSidebarContext";
import { useState } from "react";
import OrderDetailsModal from "../orders/OrderDetailsModal";
import { useLanguage } from "@/app/context/LanguageContext";
import { 
    MdAttachMoney, 
    MdShoppingBag, 
    MdInventory2, 
    MdCategory, 
    MdChevronRight, 
    MdChevronLeft, 
    MdTrendingUp, 
    MdOutlineDateRange,
    MdAdd,
    MdViewCarousel,
    MdStorefront,
    MdInbox
} from "react-icons/md";

interface RecentOrder {
    id: string;
    Name: string;
    customer: string;
    phone: string;
    streetAddress: string;
    city: string;
    product: string;
    date: string;
    amount: string;
    totalAmount: number;
    status: string;
    statusColor: string;
    createdAt: string;
    items: {
        id: string;
        quantity: number;
        price: number;
        product: {
            name: string;
            images: string;
        } | null;
    }[];
}

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCategories: number;
    recentOrders: RecentOrder[];
}

export default function DashboardClient({ stats }: { stats: DashboardStats }) {
    const { openSidebar } = useAdminSidebar();
    const { t, dir, language } = useLanguage();
    const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const isArabic = language === 'ar';

    const handleViewDetails = (order: RecentOrder) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const pendingOrdersCount = stats.recentOrders.filter(
        (o) => o.status === "PENDING" || o.status === "pending"
    ).length;

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/70 dark:bg-[#0b1120]">
            <AdminHeader title={t('admin.overview')} onMenuClick={openSidebar} />

            {/* Scrollable Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10">
                <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
                    
                    {/* Header & Quick Action Hub */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                {t("admin.dashboard")}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                                {t("admin.dashboardSubtitle")}
                            </p>
                        </div>

                        {/* Global Quick Action Shortcuts */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <Link
                                href="/admin/products"
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                            >
                                <MdAdd className="text-base" />
                                <span>{t('admin.quickActionAddProduct') || "Add Product"}</span>
                            </Link>

                            <Link
                                href="/admin/orders"
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#072835] hover:bg-[#0c4054] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                            >
                                <MdInventory2 className="text-base text-[#E5B54A]" />
                                <span>{t('admin.quickActionOrders') || "Orders"}</span>
                            </Link>

                            <Link
                                href="/admin/banners"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-white/10 transition-all active:scale-95"
                            >
                                <MdViewCarousel className="text-base text-[#B8860B]" />
                                <span>{t('admin.quickActionBanners') || "Banners"}</span>
                            </Link>
                        </div>
                    </div>

                    {/* Operational Notice Banner (if pending orders exist) */}
                    {pendingOrdersCount > 0 && (
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 shadow-xs">
                            <div className="flex items-center gap-3">
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                </span>
                                <p className="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200">
                                    {isArabic
                                        ? `لديك ${pendingOrdersCount} طلبات جديدة بانتظار المراجعة والشحن.`
                                        : `You have ${pendingOrdersCount} new order(s) awaiting processing.`}
                                </p>
                            </div>
                            <Link
                                href="/admin/orders"
                                className="px-3.5 py-1.5 rounded-xl bg-[#072835] text-white text-xs font-bold hover:bg-[#0c4054] transition-all whitespace-nowrap"
                            >
                                {t('admin.viewPendingOrders') || "Review Orders"}
                            </Link>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {/* Revenue Card */}
                        <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/10 shadow-xs transition-all duration-300 hover:shadow-md">
                            <div className="flex justify-between items-center">
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    {t('admin.totalRevenue')}
                                </p>
                                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-[#2E7D32] dark:text-[#4ade80]">
                                    <MdAttachMoney className="text-[22px]" />
                                </div>
                            </div>
                            <div className="mt-1">
                                <h3 className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-[#2E7D32] dark:text-[#4ade80]">
                                    <MdTrendingUp className="text-sm" />
                                    <span>{t("admin.allTime")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Orders Card */}
                        <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/10 shadow-xs transition-all duration-300 hover:shadow-md">
                            <div className="flex justify-between items-center">
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    {t('admin.totalOrders')}
                                </p>
                                <div className="p-2.5 bg-sky-50 dark:bg-sky-950/50 rounded-xl text-[#072835] dark:text-sky-300">
                                    <MdInventory2 className="text-[22px]" />
                                </div>
                            </div>
                            <div className="mt-1">
                                <h3 className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    {stats.totalOrders}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    <MdOutlineDateRange className="text-sm" />
                                    <span>{t("admin.totalProcessed")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Products Card (Wholesale Food Inventory) */}
                        <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/10 shadow-xs transition-all duration-300 hover:shadow-md">
                            <div className="flex justify-between items-center">
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    {t('admin.activeProducts')}
                                </p>
                                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-[#B8860B] dark:text-[#E5B54A]">
                                    <MdShoppingBag className="text-[22px]" />
                                </div>
                            </div>
                            <div className="mt-1">
                                <h3 className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    {stats.totalProducts}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    <span>{t("admin.inCatalog")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Categories Card */}
                        <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/10 shadow-xs transition-all duration-300 hover:shadow-md">
                            <div className="flex justify-between items-center">
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    {t('admin.categories')}
                                </p>
                                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                                    <MdCategory className="text-[22px]" />
                                </div>
                            </div>
                            <div className="mt-1">
                                <h3 className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    {stats.totalCategories}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    <span>{t("admin.activeSections")}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">
                                    {t('admin.recentOrders')}
                                </h3>
                            </div>
                            <Link
                                href="/admin/orders"
                                className="text-[#B8860B] dark:text-[#E5B54A] hover:underline text-xs font-bold transition-all flex items-center gap-1"
                            >
                                <span>{t('admin.viewAll')}</span>
                                {dir === 'rtl' ? <MdChevronLeft /> : <MdChevronRight />}
                            </Link>
                        </div>

                        <OrderDetailsModal
                            isOpen={isDetailsModalOpen}
                            onClose={() => {
                                setIsDetailsModalOpen(false);
                                setSelectedOrder(null);
                            }}
                            order={selectedOrder as any}
                        />

                        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0f172a] overflow-hidden shadow-xs">
                            <div className="overflow-x-auto">
                                <table className={`w-full min-w-[800px] ${dir === 'rtl' ? 'text-end' : 'text-start'}`}>
                                    <thead>
                                        <tr className="border-b border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-slate-800/50">
                                            <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                                                {t('admin.orderId')}
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                                                {t('admin.customer')}
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                                                {t('admin.product')}
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                                                {t('admin.date')}
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                                                {t('admin.amount')}
                                            </th>
                                            <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                                                {t('admin.status')}
                                            </th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {stats.recentOrders.length > 0 ? (
                                            stats.recentOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors group"
                                                >
                                                    <td className="px-6 py-4 text-xs font-bold text-slate-900 dark:text-white">
                                                        #{order.id.slice(-6).toUpperCase()}
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-semibold text-slate-800 dark:text-slate-200">
                                                        {order.customer}
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">
                                                        {order.items.length > 0
                                                            ? (order.items[0]?.product?.name || t('admin.unknown')) + (order.items.length > 1 ? ` + ${order.items.length - 1} ${t('common.more')}` : '')
                                                            : t('admin.unknown')}
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                        {new Date(order.createdAt).toLocaleDateString(dir === 'rtl' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-extrabold text-[#072835] dark:text-[#E5B54A]">
                                                        {order.amount}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                                                                order.statusColor === "blue"
                                                                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900"
                                                                    : order.statusColor === "amber"
                                                                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900"
                                                                        : order.statusColor === "emerald"
                                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
                                                                            : order.statusColor === "red"
                                                                                ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900"
                                                                                : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                                                            }`}
                                                        >
                                                            {t(`admin.${order.status.toLowerCase()}`)}
                                                        </span>
                                                    </td>
                                                    <td className={`px-6 py-4 ${dir === 'rtl' ? 'text-start' : 'text-end'}`}>
                                                        <button
                                                            onClick={() => handleViewDetails(order)}
                                                            className={`flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-all ${dir === 'rtl' ? 'me-auto' : 'ms-auto'}`}
                                                            title={t('admin.details')}
                                                        >
                                                            {dir === 'rtl' ? <MdChevronLeft className="text-xl" /> : <MdChevronRight className="text-xl" />}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-3">
                                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                            <MdInbox className="text-2xl" />
                                                        </div>
                                                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                                            {t('admin.noRecentOrders')}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
