import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Playfair_Display, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layout/Navbar";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kowrapped.netlify.com'),
  title: {
    default: "KoReader Wrapped",
    template: "%s | KoReader Wrapped",
  },
  description: "Your year in books - Beautiful insights for your reading journey. Visualize your reading statistics from KOReader locally in your browser.",
  keywords: ["koreader", "reading", "statistics", "wrapped", "books", "ereader", "kindle", "visualization", "analytics"],
  authors: [{ name: "Dhruv Dugar" }],
  openGraph: {
    title: "KoReader Wrapped",
    description: "Discover your reading journey with beautiful insights. Privacy-focused visualization for your KOReader stats.",
    url: 'https://kowrapped.netlify.com',
    siteName: 'KoReader Wrapped',
    locale: 'en_US',
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KoReader Wrapped',
    description: 'Visualize your reading year with KoReader Wrapped',
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
    <html lang="en">
      <body
        className={`${playfair.variable} ${lora.variable} ${jetbrainsMono.variable} antialiased bg-paper-cream min-h-screen paper-texture`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
