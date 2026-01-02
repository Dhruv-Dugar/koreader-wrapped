import type { Metadata } from "next";
import { Playfair_Display, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "KoReader Wrapped",
  description: "Your year in books - Beautiful insights for your reading journey",
  keywords: ["koreader", "reading", "statistics", "wrapped", "books", "ereader", "kindle"],
  authors: [{ name: "Dhruv Dugar" }],
  openGraph: {
    title: "KoReader Wrapped",
    description: "Discover your reading journey with beautiful insights",
    type: "website",
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
        {children}
      </body>
    </html>
  );
}
