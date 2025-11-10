import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PageContextProvider } from "@/lib/contexts/page-context";
import { QueryProvider } from "@/lib/query-provider";
import { AuthProvider } from "@/lib/contexts/auth-context";
import { PortfolioProvider } from "@/lib/contexts/portfolio-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance App",
  description: "Finance App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <PortfolioProvider>
              <PageContextProvider>{children}</PageContextProvider>
            </PortfolioProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
