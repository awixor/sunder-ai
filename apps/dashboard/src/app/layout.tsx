import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { SunderProvider } from "@/context/sunder-context";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sunder AI - Local-First Privacy Shield",
  description: "Protect your sensitive data before sharing with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SunderProvider>
            <div className="min-h-screen bg-zinc-50 dark:bg-black">
              <Header />
              <main className="max-w-5xl mx-auto p-6 md:p-12">{children}</main>
            </div>
          </SunderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
