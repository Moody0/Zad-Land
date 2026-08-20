import type { Metadata, Viewport } from "next";
import { Figtree, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import InitialLoadGate from "./components/InitialLoadGate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getI18n } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const noto_sans_arabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const metadataBase =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://zadland.com";

export const viewport: Viewport = {
  themeColor: "#072835",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(metadataBase),
  title: {
    default: "Zad Land | Wholesale Food & Goods Trading - زاد لاند لتجارة وتوزيع المواد الغذائية",
    template: "%s | Zad Land - زاد لاند",
  },
  description:
    "شركة زاد لاند - المنصة الرائدة في استيراد وتوزيع المواد الغذائية والمنتجات الاستهلاكية بالجملة. موزعون معتمدون لكبرى العلامات العالمية (أمريكانا، تات، دي سيكو، سانتي، علي كافيه). توريد مباشر، جودة عالية، وأفضل أسعار الجملة.",
  keywords: [
    "Zad Land",
    "زاد لاند",
    "تجارة جملة مواد غذائية",
    "توزيع مواد غذائية سوريا",
    "استيراد مواد غذائية",
    "عروض جملة",
    "أمريكانا جملة",
    "تات معجون طماطم",
    "دي سيكو باستا",
    "سانتي حبوب إفطار",
    "علي كافيه جملة",
    "مواد استهلاكية جملة",
    "تجار جملة دمشق",
    "wholesale food distributor",
    "FMCG wholesale Syria",
    "food importer",
    "bulk food supply",
    "Americana wholesale",
    "Tat wholesale",
    "De Cecco wholesale",
    "grocery wholesale B2B"
  ],
  authors: [{ name: "Zad Land", url: metadataBase }],
  creator: "Zad Land",
  publisher: "Zad Land",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "ar-SY": "/",
      "en-US": "/?lang=en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SY",
    alternateLocale: ["en_US", "ar_SA"],
    siteName: "Zad Land | زاد لاند",
    title: "Zad Land | Wholesale Food & Goods Trading - زاد لاند",
    description:
      "شركة زاد لاند لتجارة وتوزيع المواد الغذائية بالجملة. توريد مباشر من كبرى الشركات العالمية بأفضل الأسعار المعتمدة.",
    url: metadataBase,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zad Land Wholesale Food & Goods Distribution",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zad Land | Wholesale Food & Goods Trading - زاد لاند",
    description:
      "شركة زاد لاند لتجارة وتوزيع المواد الغذائية بالجملة. توريد مباشر من كبرى الشركات العالمية بأفضل الأسعار المعتمدة.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.jpeg", type: "image/jpeg" },
      { url: "/rounded-favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
  category: "food & beverage",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const { language, dir } = await getI18n();
  const settings = await prisma.settings.findUnique({
      where: { id: "site-settings" },
      select: { exchangeRate: true }
  });
  const exchangeRate = settings?.exchangeRate ? Number(settings.exchangeRate) : 135;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    "name": "Zad Land - زاد لاند",
    "url": metadataBase,
    "logo": `${metadataBase}/logo.jpeg`,
    "image": `${metadataBase}/og-image.jpg`,
    "description": "شركة زاد لاند لتجارة وتوزيع المواد الغذائية والمنتجات الاستهلاكية بالجملة.",
    "currenciesAccepted": "SYP, USD",
    "paymentAccepted": "Cash, Bank Transfer",
    "areaServed": "Syria",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SY"
    }
  };

  return (
    <html lang={language} dir={dir} suppressHydrationWarning className={`${figtree.variable} ${noto_sans_arabic.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var root = document.documentElement;
                root.classList.add('app-loading');
              })();
            `,
          }}
        />
        <link
          rel="preload"
          as="image"
          href="https://lh3.googleusercontent.com/aida-public/AB6AXuB8pRgU38opDPgidWmDRVHh18-R0XsEouLP3xdxsGLZz4BX3nQjc-9PXhgFNDVECMvP80S7ZtFmpA-QwwrnKgOR8B7WY0FlM3qJCAf1J8cxpwvyt6V15oxTZz-uhtroLEp-87KWQzsp-6-2mVURrFG_Q6mWjJ5YGqT0gqwmcLOPMK6pDk77rqmdXEvvM82qGkXdLNmSeXBPXY9j9zwnT_PjJ5YAOzWa2PqrFvo1SOjMCtz71ZHQraBSPlt7TKx00ccpwm4TTWoB6b0y"
          type="image/avif"
        />
      </head>
      <body
        className={`${figtree.className} ${noto_sans_arabic.className} antialiased`}
        suppressHydrationWarning
      >
        <div id="initial-page-loader" aria-hidden="true">
          <div className="initial-page-loader__panel">
            <div className="initial-page-loader__spinner" />
            <p className="initial-page-loader__brand">Zad Land</p>
          </div>
        </div>
        <div id="app-shell">
          <InitialLoadGate />
          <Providers session={session} initialExchangeRate={exchangeRate}>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
