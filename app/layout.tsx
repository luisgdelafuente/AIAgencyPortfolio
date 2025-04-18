import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { defaultMetadata } from "./lib/staticMetadata";

const inter = Inter({ subsets: ["latin"] });

/**
 * Root-level metadata that will be inherited by all pages
 * Using the static approach recommended by Next.js 13+
 */
export const metadata: Metadata = {
  ...defaultMetadata,
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.png",
  },
  authors: [{ name: "HAL149", url: "https://hal149.com" }],
  metadataBase: new URL('https://hal149.com'),
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
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}