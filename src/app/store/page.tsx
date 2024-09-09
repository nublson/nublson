import { Header, PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import pageData from "@/utils/pages.json";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = `${process.env.BASE_URL}/store`;

  return {
    title: pageData.store.title,
    description: pageData.store.description,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      type: "website",
      url: baseUrl,
      title: pageData.store.title,
      description: pageData.store.description,
      siteName: "nublson.com",
    },
    twitter: {
      card: "summary_large_image",
      site: baseUrl,
      title: pageData.store.title,
      description: pageData.store.description,
      images: pageData.store.thumbnail,
      creator: "@nublson",
    },
  };
}

export default async function StorePage() {
  const allPostsData = await getData(
    process.env.NOTION_DATABASE_CONTENT_ID as string,
    "Store",
    undefined,
    "products"
  );

  return (
    <>
      <Header
        label={pageData.store.label}
        title={pageData.store.title}
        thumbnail={pageData.store.thumbnail}
        description={pageData.store.description}
        scrollIcon
      />
      <Suspense fallback={<div>Loading...</div>}>
        <PostsSection
          posts={allPostsData.posts}
          allPosts={allPostsData.posts}
          type="store"
        />
      </Suspense>
    </>
  );
}
