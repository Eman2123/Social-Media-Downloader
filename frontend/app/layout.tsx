import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-ignore: CSS module import handled by Next.js
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VideoSave - Download Videos From Any Platform",
  description: "Download videos from YouTube, TikTok, Instagram, Facebook, Twitter/X and more. Free, fast, no signup required.",
  keywords: "video downloader, youtube downloader, tiktok downloader, instagram downloader, free video download",
  icons: {
    icon: [
      { url: "/favicon.ico",    sizes: "any" },
      { url: "/favicon.svg",    type: "image/svg+xml" },
      { url: "/icon-16.png",    sizes: "16x16",  type: "image/png" },
      { url: "/icon-32.png",    sizes: "32x32",  type: "image/png" },
      { url: "/icon-48.png",    sizes: "48x48",  type: "image/png" },
    ],
    apple: { url: "/icon-180.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}