import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/providers/toaster";
import { ToastProvider } from "@/components/providers/toast-provider";
import { LanguageProvider } from "@/hooks/use-language";
import { TranslationProvider } from "@/hooks/use-translations";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'),
  title: "HAL149 | Next-Generation AI Solutions",
  description: "Expert AI solutions for businesses seeking innovation and transformation",
  keywords: "AI, artificial intelligence, machine learning, data analysis, digital transformation",
  robots: "index, follow",
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
        <ToastProvider>
          <LanguageProvider>
            <TranslationProvider>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </TranslationProvider>
          </LanguageProvider>
        </ToastProvider>
      </body>
    </html>
  );
}