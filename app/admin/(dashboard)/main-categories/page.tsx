import { getAdminMainCategories } from "../../../../lib/admin-actions";
import MainCategoriesClient from "./MainCategoriesClient";

export const dynamic = "force-dynamic";

export default async function AdminMainCategoriesPage() {
    const mainCategories = await getAdminMainCategories();

    return <MainCategoriesClient mainCategories={mainCategories} />;
}
