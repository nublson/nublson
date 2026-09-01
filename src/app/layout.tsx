import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { SkipLink } from "@/components/skip-link";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WebmcpProvider } from "@/components/webmcp-provider";
import { TWITTER_CREATOR_HANDLE } from "@/utils/share-metadata";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
    images: [{ url: "/apple-icon.png" }],
  },
  twitter: {
    card: "summary_large_image",
    creator: TWITTER_CREATOR_HANDLE,
    images: ["/apple-icon.png"],
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
      <head>
        {/* ARD discovery: rel="ard" is the normative relation; the
            predecessor rel="ai-catalog" is emitted for consumers that
            have not yet moved off it. Both point at the same manifest. */}
        <link rel="ard" href="/.well-known/ai-catalog.json" />
        <link rel="ai-catalog" href="/.well-known/ai-catalog.json" />
      </head>
      <body className="relative min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
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
              className="flex-1 wrapper flex flex-col items-start justify-start gap-10 lg:gap-[60px] outline-none"
            >
              {children}
            </main>
            <Footer />
            <SpeedInsights />
            <Analytics />
            <WebmcpProvider />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
