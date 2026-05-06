import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { SkipLink } from "@/components/skip-link";
import { TWITTER_CREATOR_HANDLE } from "@/utils/share-metadata";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL!),
  title: {
    template: "%s | Nubelson Fernandes",
    default: "Nubelson Fernandes",
  },
  description: "Designer and developer sharing work, writing, and tools.",
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Blog & work" },
        { url: "/blog/feed.xml", title: "Blog" },
        { url: "/work/feed.xml", title: "Work" },
      ],
    },
  },
  openGraph: {
    siteName: "Nubelson Fernandes",
    locale: "en_US",
    type: "website",
    images: [{ url: "/logo.svg" }],
  },
  twitter: {
    card: "summary_large_image",
    creator: TWITTER_CREATOR_HANDLE,
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Nubelson Fernandes",
              url: process.env.BASE_URL,
            }}
          />
          <SkipLink />
          <Header />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 wrapper flex flex-col items-start justify-start gap-[60px] outline-none"
          >
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
