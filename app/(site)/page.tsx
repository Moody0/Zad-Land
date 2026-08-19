import Main from "../components/HomePageComponents/Main";
import {
    getActiveBanners,
    getMainCategoryBrands,
    getHomeRailCategories,
    getCategoryHighlightCardsData,
    getApprovedReviews,
    getBestSellerProducts,
    getOnSaleProducts,
    getNewArrivalProducts,
    getSiteSettings,
    getTrendingWeeklyProducts,
    getFeaturedCategories,
} from "../../lib/admin-actions";

export const revalidate = 86400; // Revalidate every 24 hours

export default async function Home() {
    const [
        banners,
        mainBrands,
        railCategories,
        highlightCards,
        reviews,
        featuredBestSellers,
        featuredNewArrivals,
        featuredBundles,
        settings,
        trendingWeekly,
        featuredCategories,
    ] = await Promise.all([
        getActiveBanners(),
        getMainCategoryBrands(),
        getHomeRailCategories(),
        getCategoryHighlightCardsData(),
        getApprovedReviews(),
        getBestSellerProducts(),
        getNewArrivalProducts(),
        getOnSaleProducts(),
        getSiteSettings(),
        getTrendingWeeklyProducts(),
        getFeaturedCategories(),
    ]);

    return (
        <section>
            <Main
                banners={banners}
                mainBrands={mainBrands}
                railCategories={railCategories}
                highlightCards={highlightCards}
                reviews={reviews}
                featuredNewArrivals={featuredNewArrivals}
                featuredBundles={featuredBundles}
                featuredBestSellers={featuredBestSellers}
                settings={settings}
                trendingWeekly={trendingWeekly}
                featuredCategories={featuredCategories}
            />
        </section>
    );
}
