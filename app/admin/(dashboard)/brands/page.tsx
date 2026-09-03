import { getAdminBrands } from "../../../../lib/admin-actions";
import BrandsClient from "./BrandsClient";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
    const brands = await getAdminBrands();

    return <BrandsClient brands={brands} />;
}
