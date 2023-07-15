import { ContentSection, Header, ShareSection } from "@/sections";
import { getBlocks, getData } from "@/services/notion";
import { DynamicPageProps } from "@/utils/types";
import moment from "moment";

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
          <p>Posted in Self-Improvement</p>
        </ShareSection>
      </>
    );
  }
}
