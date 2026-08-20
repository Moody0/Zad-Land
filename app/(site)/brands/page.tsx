import Link from "next/link";
import { getCatalogBrands } from "@/lib/catalog";
import { getI18n } from "@/lib/i18n";
import ResilientImage from "@/app/components/ResilientImage";
import { MdStar } from "react-icons/md";

const fallbackImage = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800";

export const metadata = {
    title: "العلامات التجارية والشركات العالمية | Global Partner Brands - Zad Land",
    description: "استكشف قائمة العلامات التجارية والشركات العالمية الموزعة حصرياً وبأسعار الجملة عبر شركة زاد لاند (أمريكانا، تات، دي سيكو، سانتي، علي كافيه، وغيرها).",
    alternates: {
        canonical: "/brands",
    },
    openGraph: {
        title: "العلامات التجارية المعتمدة | Zad Land",
        description: "استكشف العلامات التجارية والشركات العالمية الموزعة عبر شركة زاد لاند لتجارة المواد الغذائية.",
        url: "/brands",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Zad Land Partner Brands",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "العلامات التجارية المعتمدة | Zad Land",
        description: "استكشف العلامات التجارية والشركات العالمية الموزعة عبر شركة زاد لاند لتجارة المواد الغذائية.",
        images: ["/og-image.jpg"],
    },
};

export default async function BrandsPage() {
    const [brands, { t }] = await Promise.all([
        getCatalogBrands(),
        getI18n(),
    ]);

    const featuredBrands = brands.filter((brand) => brand.isFeatured);

    const renderBrandCard = (brand: typeof brands[0], isHighlight = false) => (
        <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className={`group flex min-h-[160px] flex-col justify-between rounded-2xl border transition-all duration-300 hover:-translate-y-1 p-3.5 ${
                isHighlight
                    ? "border-[#B8860B]/30 bg-gradient-to-b from-[#FAF6EC]/60 to-white shadow-xs hover:border-[#B8860B] hover:shadow-md dark:border-[#B8860B]/20 dark:from-[#B8860B]/5 dark:to-white/5"
                    : "border-slate-200/80 bg-white hover:border-[#072835] hover:shadow-md dark:border-white/10 dark:bg-white/5"
            }`}
        >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-white dark:bg-white/5 p-2 flex items-center justify-center border border-slate-100 dark:border-white/5">
                <ResilientImage
                    src={brand.image || fallbackImage}
                    alt={brand.name}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                {brand.isFeatured && (
                    <span className="absolute top-1.5 end-1.5 size-5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300 flex items-center justify-center shadow-xs">
                        <MdStar className="text-xs" />
                    </span>
                )}
            </div>
            <div className="pt-3 text-center">
                <p className="line-clamp-2 text-sm font-bold text-slate-800 transition-colors group-hover:text-[#072835] dark:text-white dark:group-hover:text-[#E5B54A]">
                    {brand.name}
                </p>
            </div>
        </Link>
    );

    return (
        <main className="container-custom py-8 md:py-12">
            <div className="mb-10 border-b border-slate-200/80 pb-6 dark:border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B8860B] dark:text-[#E5B54A]">
                        {t("brands.catalogEyebrow") || "GLOBAL PARTNERS"}
                    </p>
                    <h1 className="mt-2 text-3xl font-extrabold text-[#072835] dark:text-white md:text-5xl tracking-tight">
                        {t("brands.title") || "Our Brands"}
                    </h1>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {brands.length} {t("brands.totalBrands") || "Brands Available"}
                </p>
            </div>

            {/* Featured Brands (if any) */}
            {featuredBrands.length > 0 && (
                <section className="mb-12">
                    <div className="mb-5 flex items-center gap-2">
                        <div className="size-2 rounded-full bg-[#B8860B]" />
                        <h2 className="text-xl font-bold text-[#072835] dark:text-white flex items-center gap-2">
                            {t("admin.featured") || "Featured Brands"}
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                        {featuredBrands.map((brand) => renderBrandCard(brand, true))}
                    </div>
                </section>
            )}

            {/* All Brands Directory */}
            <section>
                <div className="mb-5 flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#072835] dark:bg-white/40" />
                    <h2 className="text-xl font-bold text-[#072835] dark:text-white">
                        {t("admin.allBrands") || "All Brands Catalog"}
                    </h2>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                    {brands.map((brand) => renderBrandCard(brand))}
                </div>
            </section>
        </main>
    );
}
