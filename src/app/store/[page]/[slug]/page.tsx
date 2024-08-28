import { ContentSection, Header, ShareSection } from "@/sections";
import { getBlocks, getData } from "@/services/notion";
import { setToCurrentDate } from "@/utils/formatter";
import { DynamicPageProps } from "@/utils/types";
import { findPostBySlug } from "@/utils/utils";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { slug, page: pageNumber } = params;

  const post = await findPostBySlug(
    slug,
    process.env.NOTION_DATABASE_CONTENT_ID as string,
    "Store"
  );

  if (post) {
    const postUrl = `/store/${pageNumber}/${post.post_slug}`;

    return {
      title: post.title,
      description: post.description,
      category: post.category,
      keywords: post.keywords,
      alternates: {
        canonical: postUrl,
      },
      openGraph: {
        type: "article",
        url: `${process.env.BASE_URL}${postUrl}`,
        title: post.title,
        description: post.description,
        siteName: "nublson.com",
      },
      twitter: {
        card: "summary_large_image",
        site: `${process.env.BASE_URL}${postUrl}`,
        title: post.title,
        description: post.description,
        images: post.thumbnail,
        creator: "@nublson",
      },
    };
  } else {
    return {};
  }
}

export async function generateStaticParams() {
  const data = await getData(
    process.env.NOTION_DATABASE_CONTENT_ID,
    "Store",
    1,
    undefined,
    "products"
  );

  return data.posts.map((post) => ({
    slug: post.post_slug,
  }));
}

export default async function Page({ params }: DynamicPageProps) {
  const { slug, page: pageNumber } = params;

  if (!pageNumber || isNaN(Number(pageNumber))) {
    return notFound();
  }

  const allPostsData = await getData(
    process.env.NOTION_DATABASE_CONTENT_ID as string,
    "Store",
    1,
    undefined,
    "products"
  );
  const postsPerPage = 10;
  const totalPosts = allPostsData.posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  if (Number(pageNumber) > totalPages) {
    return notFound();
  }

  const post = await findPostBySlug(
    slug,
    process.env.NOTION_DATABASE_CONTENT_ID as string,
    "Store"
  );

  if (!post) {
    return notFound();
  }

  const postIndex = allPostsData.posts.findIndex((p) => p.id === post.id);

  const expectedPageNumber = Math.floor(postIndex / postsPerPage) + 1;

  if (Number(pageNumber) !== expectedPageNumber) {
    return notFound();
  }

  const postBlocks = await getBlocks(post.id);

  return (
    <>
      <Header
        label={setToCurrentDate(post.publish_date, "LL")}
        title={post.title}
        thumbnail={post.thumbnail}
        description={post.description}
      />
      <ContentSection blocks={postBlocks} data={post} />
      <ShareSection>
        <p>
          Posted in{" "}
          <Link href={`/store/${pageNumber}?category=${post.category}`}>
            {post.category}
          </Link>{" "}
        </p>
      </ShareSection>
    </>
  );
}
