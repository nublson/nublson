import { describe, expect, it } from "vitest";
import { buildShareMetadata } from "./share-metadata";

const input = { title: "A post", description: "About it" };

const images = (metadata: ReturnType<typeof buildShareMetadata>) => ({
  og: (metadata.openGraph?.images as { url: string }[])[0].url,
  twitter: (metadata.twitter?.images as string[])[0],
});

describe("buildShareMetadata", () => {
  it("shares the given image", () => {
    const metadata = buildShareMetadata({
      ...input,
      image: "/writings/a-post/opengraph-image",
    });
    expect(images(metadata)).toEqual({
      og: "/writings/a-post/opengraph-image",
      twitter: "/writings/a-post/opengraph-image",
    });
  });

  it("falls back to the app icon without an image", () => {
    expect(images(buildShareMetadata({ ...input, image: " " }))).toEqual({
      og: "/apple-icon.png",
      twitter: "/apple-icon.png",
    });
  });
});
