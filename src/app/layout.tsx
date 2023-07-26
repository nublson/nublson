import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.scss";

import { Layout } from "@/components/Layout";
import { Footer } from "@/components/shared/Footer";

import pages from "@/utils/pages.json";
import social from "@/utils/social.json";

const GTM_ID = "GTM-M88VGKTR";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
      <body className={poppins.className}>
        <Layout>{children}</Layout>
        <Footer socialList={social.items} />
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
