import { getPage } from "@/services/notion";
import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 1920,
  height: 1080,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  const page = await getPage(process.env.NOTION_PAGE_GEARS_ID);

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
        <img src={page.thumbnail} alt={page.title} />
      </div>
    ),
    {
      ...size,
    }
  );
}
