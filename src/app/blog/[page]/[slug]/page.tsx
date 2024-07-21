import { ContentSection, Header, ShareSection } from "@/sections";
import { getBlocks, getData } from "@/services/notion";
import { setToCurrentDate } from "@/utils/formatter";
import { DynamicPageProps, MetadataProps } from "@/utils/types";
import { findPostBySlug } from "@/utils/utils";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { slug } = params;

  const result = await findPostBySlug(
    slug,
    process.env.NOTION_DATABASE_ARTICLES_ID as string
  );

  if (result) {
    const { post, pageNumber } = result;
    const postUrl = `/blog/${pageNumber}/${post.post_slug}`;

    return {
      title: post.title,
      description: post.description,
      category: post.category,
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
    };
  } else {
    return {};
  }
}

export async function generateStaticParams() {
  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID, 1);

  return data.posts.map((post) => ({
    slug: post.post_slug,
  }));
}

export default async function Page({ params }: DynamicPageProps) {
  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID, 1);

  const myPost = data.posts.find((post) => {
    return post.post_slug === params.slug;
  });

  if (myPost) {
    const postBlocks = await getBlocks(myPost.id);

    return (
      <>
        <Header
          label={setToCurrentDate(myPost.publish_date, "LL")}
          title={myPost.title}
          thumbnail={myPost.thumbnail}
          description={myPost.description}
        />
        <ContentSection blocks={postBlocks} data={myPost} />
        <ShareSection>
          <p>
            Posted in{" "}
            <Link href={`/blog?category=${myPost.category}`}>
              {myPost.category}
            </Link>{" "}
          </p>
        </ShareSection>
      </>
    );
  } else {
    notFound();
  }
}
