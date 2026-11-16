import { describe, expect, it } from "vitest";
import { buildShareMetadata } from "./share-metadata";

const input = { title: "A post", description: "About it" };

const images = (metadata: ReturnType<typeof buildShareMetadata>) => ({
  og: (metadata.openGraph?.images as { url: string }[])[0].url,
  twitter: (metadata.twitter?.images as string[])[0],
});

describe("buildShareMetadata", () => {
  it("shares the thumbnail when there is one", () => {
    const metadata = buildShareMetadata({
      ...input,
      thumbnail: "https://x.dev/cover.jpg",
    });
    expect(images(metadata)).toEqual({
      og: "https://x.dev/cover.jpg",
      twitter: "https://x.dev/cover.jpg",
    });
  });

  it("falls back to the app icon without a thumbnail", () => {
    expect(images(buildShareMetadata({ ...input, thumbnail: " " }))).toEqual({
      og: "/apple-icon.png",
      twitter: "/apple-icon.png",
    });
  });
});
