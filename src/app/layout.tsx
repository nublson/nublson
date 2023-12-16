import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { Lora, Poppins } from "next/font/google";
import GoogleAnalytics from "./GoogleAnalytics";
import "./globals.scss";

import { Layout } from "@/components/Layout";
import { Footer } from "@/components/shared/Footer";

import pages from "@/utils/pages.json";
import social from "@/utils/social.json";

const GTM_ID = "GTM-M88VGKTR";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const lora = Lora({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Nubelson Fernandes",
    default: "Nubelson Fernandes",
  },
  description: pages.home.description,
  metadataBase: new URL(process.env.BASE_URL),
  verification: {
    google:
      "google-site-verification=f33po4sil38rZF5iD10dHpJlINIXWeaOFnTOqwBey-s",
  },
};

export const revalidate = 10;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${lora.variable}`}>
      <body>
        <Layout>{children}</Layout>
        <Footer socialList={social.items} />
        <GoogleAnalytics />
        <GoogleTagManager gtmId={GTM_ID} />
        <Analytics />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display: none; visibility: hidden;"></iframe>`,
          }}
        />
      </body>
    </html>
  );
}
