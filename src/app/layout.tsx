import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.scss";

import { Layout } from "@/components/Layout";
import { Footer } from "@/components/shared/Footer";

import social from "@/utils/social.json";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Nubelson Fernandes",
    default: "Nubelson Fernandes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Layout>{children}</Layout>
        <Footer socialList={social.items} />
        <Analytics />
      </body>
    </html>
  );
}
