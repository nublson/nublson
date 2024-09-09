import { findPostBySlug } from "@/utils/utils";
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
  const myPost = await findPostBySlug(
    params.slug,
    process.env.NOTION_DATABASE_CONTENT_ID as string,
    "Blog"
  );

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
