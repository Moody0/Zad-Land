import Link from "next/link";
import { getCatalogBrands } from "@/lib/catalog";
import { getI18n } from "@/lib/i18n";
import ResilientImage from "@/app/components/ResilientImage";

const fallbackImage = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800";

export const metadata = {
    title: "Brands | Zad Land",
    description: "Browse Zad Land's global partner brands and distribution catalogs.",
};

export default async function BrandsPage() {
    const [brands, { t }] = await Promise.all([
        getCatalogBrands(),
        getI18n(),
    ]);

    const mainBrands = brands.filter((brand) => brand.group === "MAIN");
    const differentBrands = brands.filter((brand) => brand.group === "DIFFERENT");

    const renderBrands = (items: typeof brands) => (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {items.map((brand) => (
                <Link
                    key={brand.id}
                    href={`/brands/${brand.slug}`}
                    className="group flex min-h-[152px] flex-col justify-between rounded-xl border border-[#B8860B]/15 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-[#B8860B] dark:border-white/10 dark:bg-white/5"
                >
                    <div className="aspect-square overflow-hidden rounded-lg bg-[#FAF6EC] dark:bg-white/5 p-1">
                        <ResilientImage
                            src={brand.image || fallbackImage}
                            alt={brand.name}
                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="pt-3">
                        <p className="line-clamp-2 text-sm font-bold text-text-main-light transition-colors group-hover:text-[#B8860B] dark:text-white">
                            <span className="group-hover-underline-animated">{brand.name}</span>
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );

    return (
        <main className="container-custom py-8 md:py-12">
            <div className="mb-8 border-b border-gray-200 pb-6 dark:border-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B8860B] dark:text-[#E5B54A]">
                    {t("brands.catalogEyebrow")}
                </p>
                <h1 className="mt-3 text-4xl font-semibold text-text-main-light dark:text-white md:text-5xl">
                    {t("brands.title")}
                </h1>
            </div>

            <section className="mb-12">
                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-text-main-light dark:text-white">{t("brands.mainBrands")}</h2>
                        <p className="mt-1 text-sm text-text-muted-light dark:text-white/50">{t("brands.mainBrandsDescription")}</p>
                    </div>
                </div>
                {renderBrands(mainBrands)}
            </section>

            <section>
                <div className="mb-5">
                    <h2 className="text-2xl font-bold text-text-main-light dark:text-white">{t("brands.differentBrands")}</h2>
                    <p className="mt-1 text-sm text-text-muted-light dark:text-white/50">{t("brands.differentBrandsDescription")}</p>
                </div>
                {renderBrands(differentBrands)}
            </section>
        </main>
    );
}

