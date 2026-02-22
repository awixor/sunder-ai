import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { SunderProvider } from "@/context/sunder-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "Sunder - Local-First AI Privacy Firewall",
    template: "%s | Sunder",
  },
  description:
    "The local-first privacy firewall that scrubs PII from AI prompts before they ever leave your browser. Fast. Private. Open Source.",
  applicationName: "Sunder AI",
  keywords: [
    "AI Privacy",
    "Local-first",
    "PII Scrubbing",
    "Rust",
    "WebAssembly",
    "Sunder",
    "Data Privacy",
    "LLM Security",
  ],
  authors: [{ name: "awixor" }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Sunder - Local-First AI Privacy Firewall",
    description:
      "The local-first privacy firewall that scrubs PII from AI prompts before they ever leave your browser.",
    url: "/",
    siteName: "Sunder AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunder - Local-First AI Privacy Firewall",
    description:
      "The local-first privacy firewall that scrubs PII from AI prompts before they ever leave your browser.",
    creator: "@sunder_ai",
  },
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SunderProvider>{children}</SunderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
