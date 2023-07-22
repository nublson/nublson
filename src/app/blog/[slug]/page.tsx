import { ContentSection, Header, ShareSection } from "@/sections";
import { getBlocks, getData } from "@/services/notion";
import { DynamicPageProps, MetadataProps } from "@/utils/types";
import moment from "moment";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { slug } = params;

  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID);

  const myPost = data.find((post) => {
    return post.post_slug === slug;
  });

  return {
    title: myPost?.title,
    description: myPost?.description,
  };
}

export async function generateStaticParams() {
  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID);

  return data.map((post) => ({
    slug: post.post_slug,
  }));
}

export const revalidate = 60;

export default async function Page({ params }: DynamicPageProps) {
  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID);

  const myPost = data.find((post) => {
    return post.post_slug === params.slug;
  });

  if (!myPost) {
    return <h1>404</h1>;
  } else {
    const postBlocks = await getBlocks(myPost.id);

    return (
      <>
        <Header
          label={moment(myPost.publish_date).format("MMMM d, YYYY")}
          title={myPost.title}
          thumbnail={myPost.thumbnail}
          description={myPost.description}
        />
        <ContentSection blocks={postBlocks} />
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
