import type { Metadata, Viewport } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://belajarn.gaji.app";

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
  title: "Belajar Ngaji - Aplikasi Pembelajaran Hijaiyah",
  description: "Aplikasi pembelajaran huruf Hijaiyah, Al-Qur'an, Dhikr, dan Kuis interaktif",
  keywords: ["hijaiyah", "quran", "dhikr", "islamic", "learning", "arabic"],
  authors: [{ name: "Belajar Ngaji Team" }],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Belajar Ngaji - Aplikasi Pembelajaran Hijaiyah",
    description: "Belajar Hijaiyah, Al-Qur'an, Dhikr, dan kuis interaktif dalam satu aplikasi.",
    siteName: "Belajar Ngaji",
    images: [
      {
        url: "/images/logo/image.png",
        width: 512,
        height: 512,
        alt: "Belajar Ngaji",
      },
    ],
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    site: "@belajarn_gaji",
    title: "Belajar Ngaji - Aplikasi Pembelajaran Hijaiyah",
    description: "Belajar Hijaiyah, Al-Qur'an, Dhikr, dan kuis interaktif.",
    images: ["/images/logo/image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/logo/image.png',
    shortcut: '/images/logo/image.png',
    apple: '/images/logo/image.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${amiri.variable} antialiased`}>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Belajar Ngaji",
              url: siteUrl,
              description: "Platform belajar Hijaiyah, Al-Qur'an, Dhikr, dan kuis interaktif.",
              inLanguage: "id-ID",
            }),
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
