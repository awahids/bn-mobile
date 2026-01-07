import type { Metadata, Viewport } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}