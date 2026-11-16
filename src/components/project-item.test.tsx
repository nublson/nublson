import type { PostMetadata } from "@/utils/formatter";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectItem } from "./project-item";

const post = {
  id: "1",
  title: "Sony FX30",
  description: "My main camera for videos.",
  icon: { type: "emoji", value: "📹" },
  thumbnail: "https://s3.amazonaws.com/nublson.com/fx30.png",
} as PostMetadata;

describe("ProjectItem", () => {
  it("leads with the icon by default", () => {
    const { container } = render(<ProjectItem post={post} />);
    expect(container.textContent).toContain("📹");
    expect(container.querySelector("img")).toBeNull();
  });

  it("leads with the cover when thumbnail is set", () => {
    const { container } = render(<ProjectItem post={post} thumbnail />);
    expect(container.textContent).not.toContain("📹");
    expect(container.querySelector("img")?.getAttribute("src")).toContain(
      encodeURIComponent(post.thumbnail!),
    );
  });

  it("falls back to the icon when there is no cover", () => {
    const { container } = render(
      <ProjectItem post={{ ...post, thumbnail: undefined }} thumbnail />,
    );
    expect(container.textContent).toContain("📹");
  });
});
