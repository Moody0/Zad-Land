import React from 'react';

export default function BrandLoadingSkeleton() {
    return (
        <div className="flex-1 container-custom py-4 md:py-6" aria-busy="true">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-16 h-3.5 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                <span className="text-gray-300 dark:text-zinc-700">/</span>
                <div className="w-24 h-3.5 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                <span className="text-gray-300 dark:text-zinc-700">/</span>
                <div className="w-32 h-3.5 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
            </div>

            {/* Brand Hero Card Skeleton */}
            <div className="rounded-2xl bg-[#FAF6EC]/80 dark:bg-[#1A1A14] border border-[#B8860B]/20 p-5 sm:p-7 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-[84px] h-[84px] sm:w-[100px] sm:h-[100px] rounded-2xl bg-white dark:bg-zinc-900 border-2 border-[#B8860B]/30 shrink-0 relative overflow-hidden">
                    <div className="image-shimmer absolute inset-0" />
                </div>
                <div className="flex-1 flex flex-col items-center sm:items-start gap-2.5 w-full">
                    <div className="flex gap-2">
                        <div className="w-28 h-5 bg-green-100 dark:bg-green-950/40 rounded-full animate-pulse" />
                        <div className="w-24 h-5 bg-amber-100 dark:bg-amber-950/40 rounded-full animate-pulse" />
                    </div>
                    <div className="w-56 h-8 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                    <div className="w-full max-w-md h-4 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
            </div>

            {/* Product Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-white/10 p-3 sm:p-4 flex flex-col gap-3"
                    >
                        <div className="w-full aspect-square rounded-xl bg-gray-100 dark:bg-zinc-800 overflow-hidden relative">
                            <div className="image-shimmer absolute inset-0" />
                        </div>
                        <div className="w-20 h-3 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                        <div className="w-full h-4 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                        <div className="w-28 h-5 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse mt-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}
