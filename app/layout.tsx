import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/toaster";
import MetadataWrapper from "@/components/MetadataWrapper";

const inter = Inter({ subsets: ["latin"] });

/**
 * Root-level metadata with sensible defaults
 * These serve as fallback values before the MetadataWrapper updates them dynamically
 */
export const metadata: Metadata = {
  title: {
    template: '%s | HAL149',
    default: 'HAL149 | Unlocking Your Business Potential with AI',
  },
  description: 'HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs',
  keywords: 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
  
  openGraph: {
    title: 'HAL149 | Unlocking Your Business Potential with AI',
    description: 'HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs',
    url: 'https://hal149.com',
    siteName: 'HAL149',
    images: [
      {
        url: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp',
        width: 480,
        height: 480,
        alt: 'HAL149 Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'HAL149 | Unlocking Your Business Potential with AI',
    description: 'HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs',
    images: ['https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp'],
    creator: '@hal149',
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    }
  },
  
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.png",
  },
  
  authors: [{ name: "HAL149", url: "https://hal149.com" }],
  metadataBase: new URL('https://hal149.com'),
  
  alternates: {
    canonical: 'https://hal149.com',
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
        <AuthProvider>
          {/* Metadata wrapper component that dynamically loads and applies metadata */}
          <MetadataWrapper />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}