import { getData } from "@/services/notion";
import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 1920,
  height: 1080,
};

export const contentType = "image/png";

interface Props {
  params: {
    slug: string;
  };
}

// Image generation
export default async function Image({ params }: Props) {
  const data = await getData(
    process.env.NOTION_DATABASE_CONTENT_ID,
    "Store",
    1,
    undefined,
    "products"
  );

  const myPost = data.posts.find((post) => post.post_slug === params.slug);

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: "#020202",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={myPost?.thumbnail} alt={myPost?.title} />
      </div>
    ),
    {
      ...size,
    }
  );
}
