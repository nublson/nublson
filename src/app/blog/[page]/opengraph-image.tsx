import pages from "@/utils/pages.json";
import { ImageResponse } from "next/server";

// Image metadata
export const size = {
  width: 1920,
  height: 1080,
};

export const contentType = "image/png";

// Image generation
export default function Image() {
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
        <img src={pages.blog.thumbnail} alt={pages.blog.title} />
      </div>
    ),
    {
      ...size,
    }
  );
}
