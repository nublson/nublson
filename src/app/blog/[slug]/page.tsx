import { ContentSection, Header } from "@/sections";
import { getBlocks, getData } from "@/services/notion";
import { formatBlockWithChildren, formatPosts } from "@/utils/formatter";
import { DynamicPageProps } from "@/utils/types";
import moment from "moment";

export async function generateStaticParams() {
  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID);

  const posts = formatPosts(data);

  return posts.map((post) => ({
    slug: post.post_slug,
  }));
}

export default async function Page({ params }: DynamicPageProps) {
  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID);

  const posts = formatPosts(data);

  const myPost = posts.find((post) => {
    return post.post_slug === params.slug;
  });

  if (!myPost) {
    return <h1>404</h1>;
  } else {
    const postBlocks = await getBlocks(myPost.id);

    const postChildBlocks = await Promise.all(
      postBlocks
        .filter((block: any) => block.has_children)
        .map(async (block) => {
          return {
            id: block.id,
            children: await getBlocks(block.id),
          };
        })
    );

    const blocksWithChildren = formatBlockWithChildren(
      postBlocks,
      postChildBlocks
    );

    return (
      <>
        <Header
          label={moment(myPost.publish_date).format("MMMM d, YYYY")}
          title={myPost.title}
          thumbnail={myPost.thumbnail}
          description={myPost.description}
        />
        <ContentSection type="articles" blocks={blocksWithChildren} />
      </>
    );
  }
}
