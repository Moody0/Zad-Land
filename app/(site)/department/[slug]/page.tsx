import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductsClient from "../../products/ProductsClient";
import { getCatalogInitialData } from "@/lib/catalog";

export const revalidate = 60; // Cache for 60 seconds

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const department = await prisma.mainCategory.findUnique({
        where: { slug: params.slug },
        select: { name: true, description: true },
    });

    if (!department) return { title: "Department Not Found" };

    return {
        title: `${department.name} | Ruby Beauty`,
        description: department.description || `Explore ${department.name} products at Ruby Beauty`,
    };
}

export default async function DepartmentPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    
    // 1. Fetch the main category (department)
    const department = await prisma.mainCategory.findUnique({
        where: { slug: params.slug },
    });

    if (!department || !department.isActive) {
        notFound();
    }

    // 2. Fetch the catalog data specifically for this department
    const { categories, products, totalProducts } = await getCatalogInitialData(
        undefined,
        undefined,
        department.id
    );

    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            {/* 
                We can reuse ProductsClient. We pass the mainCategoryId so that 
                pagination/Load More requests append ?mainCategoryId=... to the API url.
            */}
            <ProductsClient
                key={`department-${department.id}`}
                initialCategories={categories}
                initialProducts={products}
                initialTotal={totalProducts}
                activeCategory={null}
                activeBrand={null}
                activeMainCategory={department}
            />
        </Suspense>
    );
}
