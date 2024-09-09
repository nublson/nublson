import { Header, PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import pageData from "@/utils/pages.json";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = `${process.env.BASE_URL}/resources`;

  return {
    title: pageData.resources.title,
    description: pageData.resources.description,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      type: "website",
      url: baseUrl,
      title: pageData.resources.title,
      description: pageData.resources.description,
      siteName: "nublson.com",
    },
    twitter: {
      card: "summary_large_image",
      site: baseUrl,
      title: pageData.resources.title,
      description: pageData.resources.description,
      images: pageData.resources.thumbnail,
      creator: "@nublson",
    },
  };
}

export default async function ResourcesPage() {
  const allPostsData = await getData(
    process.env.NOTION_DATABASE_CONTENT_ID as string,
    "Store",
    undefined,
    "resources"
  );

  return (
    <>
      <Header
        label={pageData.resources.label}
        title={pageData.resources.title}
        thumbnail={pageData.resources.thumbnail}
        description={pageData.resources.description}
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
