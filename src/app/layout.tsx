import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BYT Fleet Management",
  description: "BYT Fleet Management Platform — Manage your fleet, drivers, vehicles, and finances all in one place.",
  icons: {
    icon: "/byt-logomark.svg",
    apple: "/apple-icon.png",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0891b2',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
