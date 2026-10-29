import type { Metadata, Viewport } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://belajar-ngaji.online";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: {
    default: "Belajar Ngaji - Aplikasi Pembelajaran Hijaiyah",
    template: "%s | Belajar Ngaji",
  },
  description: "Aplikasi pembelajaran huruf Hijaiyah, Al-Qur'an, Dzikir, dan Kuis interaktif",
  keywords: [
    "belajar ngaji",
    "aplikasi ngaji",
    "belajar mengaji",
    "aplikasi belajar ngaji terbaik",
    "belajar hijaiyah",
    "aplikasi al quran indonesia",
    "belajar baca quran",
    "aplikasi tajwid",
    "belajar tahsin",
    "dzikir pagi petang",
    "jadwal sholat indonesia",
    "kuis islam",
    "belajar agama islam",
    "tutor belajar ngaji",
    "hafalan quran",
    "bacaan sholat",
    "ngaji online",
    "islamic learning app"
  ],
  authors: [{ name: "Belajar Ngaji Team", url: siteUrl }],
  creator: "Belajar Ngaji Team",
  publisher: "Belajar Ngaji Tracker",
  applicationName: "Belajar Ngaji",
  category: "education",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: {
      'id-ID': '/id',
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Belajar Ngaji - Aplikasi Pembelajaran Hijaiyah",
    description: "Belajar Hijaiyah, Al-Qur'an, Dzikir, dan kuis interaktif dalam satu aplikasi.",
    siteName: "Belajar Ngaji",
    images: [
      {
        url: "/images/logo/image.png",
        width: 512,
        height: 512,
        alt: "Belajar Ngaji Logo",
      },
    ],
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    site: "@belajarn_gaji",
    creator: "@belajarn_gaji",
    title: "Belajar Ngaji - Aplikasi Pembelajaran Hijaiyah",
    description: "Belajar Hijaiyah, Al-Qur'an, Dzikir, dan kuis interaktif.",
    images: ["/images/logo/image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Sized icons: the 1024px source logo is 179 KB, too heavy for a favicon.
  icons: {
    icon: [
      { url: '/images/logo/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/images/logo/favicon-32.png',
    apple: { url: '/images/logo/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Belajar Ngaji",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'geo.region': 'ID',
    'geo.placename': 'Indonesia',
    'geo.position': '-0.789275;113.921327',
    'ICBM': '-0.789275, 113.921327',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

import { PageTransition } from "@/components/shared/page-transition";
import { PWAInstallPrompt } from "@/components/shared/pwa-install-prompt";
import { themeInitScript } from "@/lib/theme-script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${inter.variable} ${amiri.variable} antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Belajar Ngaji",
              url: siteUrl,
              description: "Platform belajar Hijaiyah, Al-Qur'an, Dzikir, dan kuis interaktif.",
              inLanguage: "id-ID",
            }),
          }}
        />
        <Providers>
          <PageTransition>
            {children}
          </PageTransition>
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}

