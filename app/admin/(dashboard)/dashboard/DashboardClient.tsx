"use client";

import AdminHeader from "../../components/AdminHeader";
import Link from "next/link";
import { useAdminSidebar } from "../../context/AdminSidebarContext";
import { useState } from "react";
import OrderDetailsModal from "../orders/OrderDetailsModal";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdAttachMoney, MdShoppingBag, MdCheckroom, MdCategory, MdChevronRight, MdChevronLeft, MdTrendingUp, MdOutlineDateRange } from "react-icons/md";

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
    const { t, dir } = useLanguage();
    const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const handleViewDetails = (order: RecentOrder) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#fafafa] dark:bg-[#111111]">
            <AdminHeader title={t('admin.overview')} onMenuClick={openSidebar} />

            {/* Scrollable Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-[1400px] mx-auto flex flex-col gap-10">
                    
                    {/* Header Section */}
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-white">{t("admin.dashboard")}</h1>
                        <p className="text-sm text-text-sub dark:text-gray-400 font-medium">{t("admin.dashboardSubtitle")}</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {/* Revenue Card */}
                        <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-surface-dark border border-black/[0.04] dark:border-white/[0.04] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-none group transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)]">
                            <div className="flex justify-between items-center">
                                <p className="text-text-sub dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    {t('admin.totalRevenue')}
                                </p>
                                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-gray-400 group-hover:text-primary transition-colors">
                                    <MdAttachMoney className="text-[20px]" />
                                </div>
                            </div>
                            <div className="mt-1">
                                <h3 className="text-text-main dark:text-white text-3xl font-bold tracking-tight">
                                    ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    <MdTrendingUp className="textsm" />
                                    <span>{t("admin.allTime")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Orders Card */}
                        <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-surface-dark border border-black/[0.04] dark:border-white/[0.04] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-none group transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)]">
                            <div className="flex justify-between items-center">
                                <p className="text-text-sub dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    {t('admin.totalOrders')}
                                </p>
                                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-gray-400 group-hover:text-primary transition-colors">
                                    <MdShoppingBag className="text-[20px]" />
                                </div>
                            </div>
                            <div className="mt-1">
                                <h3 className="text-text-main dark:text-white text-3xl font-bold tracking-tight">
                                    {stats.totalOrders}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-text-sub dark:text-gray-500">
                                    <MdOutlineDateRange className="text-sm" />
                                    <span>{t("admin.totalProcessed")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Products Card */}
                        <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-surface-dark border border-black/[0.04] dark:border-white/[0.04] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-none group transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)]">
                            <div className="flex justify-between items-center">
                                <p className="text-text-sub dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    {t('admin.activeProducts')}
                                </p>
                                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-gray-400 group-hover:text-primary transition-colors">
                                    <MdCheckroom className="text-[20px]" />
                                </div>
                            </div>
                            <div className="mt-1">
                                <h3 className="text-text-main dark:text-white text-3xl font-bold tracking-tight">
                                    {stats.totalProducts}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-text-sub dark:text-gray-500">
                                    <span>{t("admin.inCatalog")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Categories Card */}
                        <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-surface-dark border border-black/[0.04] dark:border-white/[0.04] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-none group transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)]">
                            <div className="flex justify-between items-center">
                                <p className="text-text-sub dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    {t('admin.categories')}
                                </p>
                                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-gray-400 group-hover:text-primary transition-colors">
                                    <MdCategory className="text-[20px]" />
                                </div>
                            </div>
                            <div className="mt-1">
                                <h3 className="text-text-main dark:text-white text-3xl font-bold tracking-tight">
                                    {stats.totalCategories}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-text-sub dark:text-gray-500">
                                    <span>{t("admin.activeSections")}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders Section */}
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-text-main dark:text-white text-lg font-bold tracking-tight">
                                {t('admin.recentOrders')}
                            </h3>
                            <Link
                                href="/admin/orders"
                                className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors flex items-center gap-1"
                            >
                                {t('admin.viewAll')}
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

                        <div className="rounded-2xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-surface-dark overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] dark:shadow-none">
                            <div className="overflow-x-auto">
                                <table className={`w-full min-w-[800px] ${dir === 'rtl' ? 'text-end' : 'text-start'}`}>
                                    <thead>
                                        <tr className="border-b border-black/[0.04] dark:border-white/[0.04] bg-gray-50/50 dark:bg-gray-800/20">
                                            <th className={`px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400`}>
                                                {t('admin.orderId')}
                                            </th>
                                            <th className={`px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400`}>
                                                {t('admin.customer')}
                                            </th>
                                            <th className={`px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400`}>
                                                {t('admin.product')}
                                            </th>
                                            <th className={`px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400`}>
                                                {t('admin.date')}
                                            </th>
                                            <th className={`px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400`}>
                                                {t('admin.amount')}
                                            </th>
                                            <th className={`px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400`}>
                                                {t('admin.status')}
                                            </th>
                                            <th className={`px-6 py-4`}></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                                        {stats.recentOrders.length > 0 ? (
                                            stats.recentOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group"
                                                >
                                                    <td className="px-6 py-4 text-sm font-semibold text-text-main dark:text-gray-200">
                                                        #{order.id.slice(-6).toUpperCase()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-text-main dark:text-gray-200">
                                                        {order.customer}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-text-sub dark:text-gray-400">
                                                        {order.items.length > 0
                                                            ? (order.items[0]?.product?.name || t('admin.unknown')) + (order.items.length > 1 ? ` + ${order.items.length - 1} ${t('common.more')}` : '')
                                                            : t('admin.unknown')}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-text-sub dark:text-gray-400">
                                                        {new Date(order.createdAt).toLocaleDateString(dir === 'rtl' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-bold text-text-main dark:text-white">
                                                        {order.amount}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${order.statusColor === "blue"
                                                                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                                                : order.statusColor === "amber"
                                                                    ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                                                                    : order.statusColor === "emerald"
                                                                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                                        : order.statusColor === "red"
                                                                            ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                                                            : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300"
                                                                }`}
                                                        >
                                                            {t(`admin.${order.status.toLowerCase()}`)}
                                                        </span>
                                                    </td>
                                                    <td className={`px-6 py-4 ${dir === 'rtl' ? 'text-start' : 'text-end'}`}>
                                                        <button
                                                            onClick={() => handleViewDetails(order)}
                                                            className={`opacity-0 group-hover:opacity-100 flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-sub dark:text-gray-400 transition-all ${dir === 'rtl' ? 'me-auto' : 'ms-auto'}`}
                                                            title={t('admin.details')}
                                                        >
                                                            {dir === 'rtl' ? <MdChevronLeft className="text-xl" /> : <MdChevronRight className="text-xl" />}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-12 text-center text-text-sub dark:text-gray-500 text-sm">
                                                    {t('admin.noRecentOrders')}
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
