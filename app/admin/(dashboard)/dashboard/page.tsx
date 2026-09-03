import { getDashboardStats } from "../../../../lib/admin-actions";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return <DashboardClient stats={stats} />;
}
