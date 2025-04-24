import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "./components/ui/toaster";
import Providers from "./components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HAL149 | Next-Generation AI Solutions",
  description: "Expert AI solutions for businesses seeking innovation and transformation",
  keywords: "AI, artificial intelligence, machine learning, data analysis, digital transformation",
  robots: "index, follow",
  metadataBase: new URL('https://hal149.com'),
  authors: [{ name: "HAL149", url: "https://hal149.com" }],
  openGraph: {
    title: "HAL149 | Next-Generation AI Solutions",
    description: "Expert AI solutions for businesses seeking innovation and transformation",
    url: "https://hal149.com",
    siteName: "HAL149",
    images: [
      {
        url: "/hallogoblack480.webp",
        width: 480,
        height: 480,
        alt: "HAL149 Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HAL149 | Next-Generation AI Solutions",
    description: "Expert AI solutions for businesses seeking innovation and transformation",
    images: ["/hallogoblack480.webp"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}