import { getSiteSettings } from "@/lib/admin-actions";
import AboutUsClient from "./AboutUsClient";
import { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
    title: "من نحن | About Zad Land - زاد لاند لتجارة وتوزيع المواد الغذائية",
    description: "تعرف على شركة زاد لاند - الرائدة في استيراد وتوزيع المواد الغذائية والمنتجات الاستهلاكية بالجملة. شراكات عالمية مع كبرى المصانع وخدمة توريد موثوقة.",
    alternates: {
        canonical: "/about-us",
    },
    openGraph: {
        title: "من نحن | شركة زاد لاند",
        description: "تعرف على شركة زاد لاند - الرائدة في استيراد وتوزيع المواد الغذائية بالجملة.",
        url: "/about-us",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "About Zad Land",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "من نحن | شركة زاد لاند",
        description: "تعرف على شركة زاد لاند - الرائدة في استيراد وتوزيع المواد الغذائية بالجملة.",
        images: ["/og-image.jpg"],
    },
};

export default async function AboutUsPage() {
    const settings = await getSiteSettings();

    return <AboutUsClient settings={settings} />;
}
