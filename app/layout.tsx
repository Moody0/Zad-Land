import type { Metadata } from "next";
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
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(metadataBase),
  title: {
    default: "Zad Land - Wholesale Food & Goods Distribution",
    template: "%s | Zad Land"
  },
  description: "Zad Land is your trusted wholesale distributor for premium food and consumer goods from leading global brands.",
  keywords: ["wholesale", "distribution", "food distribution", "zad land", "global brands", "grocery wholesale", "توزيع مواد غذائية", "زاد لاند"],
  authors: [{ name: "Zad Land" }],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "Zad Land",
    title: "Zad Land - Wholesale Food & Goods Distribution",
    description: "Your trusted partner in wholesale food distribution from top international brands.",
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Zad Land Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zad Land - Wholesale Food & Goods Distribution",
    description: "Your trusted partner in wholesale food distribution from top international brands.",
    images: ["/logo.jpeg"],
  },
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
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

  return (
    <html lang={language} dir={dir} suppressHydrationWarning className={`${figtree.variable} ${noto_sans_arabic.variable}`}>
      <head>
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
