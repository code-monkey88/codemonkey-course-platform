import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AIプログラミング学習プラットフォーム",
    template: "%s | AIプログラミング学習",
  },
  description: "AIプログラミングを体系的に学べるオンライン講座サービス。初級から上級まで、実践的なスキルを動画で学習できます。",
  keywords: ["AI", "プログラミング", "学習", "オンライン講座", "動画学習"],
  authors: [{ name: "CodeMonkey" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    title: "AIプログラミング学習プラットフォーム",
    description: "AIプログラミングを体系的に学べるオンライン講座サービス",
    siteName: "AIプログラミング学習プラットフォーム",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIプログラミング学習プラットフォーム",
    description: "AIプログラミングを体系的に学べるオンライン講座サービス",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
