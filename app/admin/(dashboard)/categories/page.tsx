import { getAdminBrands, getAdminCategories } from "../../../../lib/admin-actions";
import CategoriesClient from "./CategoriesClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
    const [data, brands] = await Promise.all([
        getAdminCategories(),
        getAdminBrands(),
    ]);

    return <CategoriesClient categories={data.categories} brands={brands} />;
}
