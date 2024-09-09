import { Header, PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import pageData from "@/utils/pages.json";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = `${process.env.BASE_URL}/blog`;

  return {
    title: pageData.blog.title,
    description: pageData.blog.description,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      type: "website",
      url: baseUrl,
      title: pageData.blog.title,
      description: pageData.blog.description,
      siteName: "nublson.com",
    },
    twitter: {
      card: "summary_large_image",
      site: baseUrl,
      title: pageData.blog.title,
      description: pageData.blog.description,
      images: pageData.blog.thumbnail,
      creator: "@nublson",
    },
  };
}

export default async function BlogPage() {
  const allPostsData = await getData(
    process.env.NOTION_DATABASE_CONTENT_ID as string,
    "Blog"
  );

  return (
    <>
      <Header
        label={pageData.blog.label}
        title={pageData.blog.title}
        thumbnail={pageData.blog.thumbnail}
        description={pageData.blog.description}
        scrollIcon
      />
      <Suspense fallback={<div>Loading...</div>}>
        <PostsSection
          posts={allPostsData.posts}
          allPosts={allPostsData.posts}
          type="blog"
        />
      </Suspense>
    </>
  );
}
