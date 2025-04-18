import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { getPageMetadata } from "./lib/metadataUtils";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  // Try to fetch global metadata first, then fallback to home if needed
  const metadata = await getPageMetadata('global').catch(() => getPageMetadata('home'));
  
  // Add some consistent fields regardless of database content
  return {
    ...metadata,
    robots: "index, follow",
    authors: [{ name: "HAL149", url: "https://hal149.com" }],
    icons: {
      icon: "/favicon.ico",
    },
  };
}

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