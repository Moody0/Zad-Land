import React from 'react';

export default function DepartmentLoadingSkeleton() {
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

            {/* Department Header Skeleton */}
            <div className="w-56 h-8 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse mb-6" />

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
