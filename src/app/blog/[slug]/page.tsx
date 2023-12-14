import { ContentSection, Header, ShareSection } from "@/sections";
import { getBlocks, getData } from "@/services/notion";
import { setToCurrentDate } from "@/utils/formatter";
import { DynamicPageProps, MetadataProps } from "@/utils/types";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { slug } = params;

  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID);

  const myPost = data.find((post) => post.post_slug === slug);

  if (myPost) {
    return {
      title: myPost.title,
      description: myPost.description,
      category: myPost.category,
      alternates: {
        canonical: `/blog/${myPost.post_slug}`,
      },
      openGraph: {
        type: "article",
        url: `${process.env.BASE_URL}/blog/${myPost.post_slug}`,
        title: myPost.title,
        description: myPost.description,
        siteName: "nublson.com",
      },
    };
  } else {
    return {};
  }
}

export async function generateStaticParams() {
  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID);

  return data.map((post) => ({
    slug: post.post_slug,
  }));
}

export default async function Page({ params }: DynamicPageProps) {
  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID);

  const myPost = data.find((post) => {
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
  }
}
