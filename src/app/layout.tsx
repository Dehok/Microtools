import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import SiteSchema from "@/components/SiteSchema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://codeutilo.com"),
  title: {
    default: "CodeUtilo - Free Online Tools for Developers",
    template: "%s | CodeUtilo",
  },
  description:
    "100+ free online developer and AI tools: JSON formatter, prompt QA utilities, file converters, and privacy tools. Browser-only processing with no data upload required.",
  keywords: [
    "free developer tools",
    "online ai tools",
    "browser tools",
    "prompt tools",
    "privacy tools",
    "json formatter",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CodeUtilo - Free Online Tools for Developers",
    description:
      "100+ free online developer and AI tools: JSON formatter, prompt QA utilities, file converters, and privacy tools. Browser-only processing with no data upload required.",
    url: "https://codeutilo.com",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeUtilo - Free Online Tools for Developers",
    description:
      "100+ free online developer and AI tools: JSON formatter, prompt QA utilities, file converters, and privacy tools. Browser-only processing with no data upload required.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-gray-50 font-sans antialiased text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100`}
      >
        <ThemeProvider>
          <SiteSchema />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
