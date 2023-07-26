import { Metadata } from "next";
import { Header } from "../sections";

import page from "@/utils/pages.json";

export const metadata: Metadata = {
  description: page.notFound.description,
  metadataBase: new URL(process.env.BASE_URL),
  openGraph: {
    type: "website",
    url: process.env.BASE_URL,
    description: page.notFound.description,
    siteName: "nublson.com",
    images: [
      {
        url: page.notFound.thumbnail,
        width: 1920,
        height: 1080,
      },
    ],
  },
};

export default async function NotFound() {
  return (
    <>
      <Header
        label={page.notFound.label}
        title={page.notFound.title}
        thumbnail={page.notFound.thumbnail}
        description={page.notFound.description}
      />
    </>
  );
}
