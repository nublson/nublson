import type { PostMetadata } from "@/utils/formatter";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectIcon } from "./project-icon";

const base = { id: "1", title: "Quiver" } as PostMetadata;

describe("ProjectIcon", () => {
  it("renders an emoji icon", () => {
    const { container } = render(
      <ProjectIcon post={{ ...base, icon: { type: "emoji", value: "🪶" } }} />,
    );
    expect(container.textContent).toBe("🪶");
  });

  it("renders an image icon", () => {
    const { container } = render(
      <ProjectIcon
        post={{ ...base, icon: { type: "image", src: "https://x.dev/i.png" } }}
      />,
    );
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "https://x.dev/i.png",
    );
  });

  it("falls back to the cover thumbnail", () => {
    const { container } = render(
      <ProjectIcon post={{ ...base, thumbnail: "https://x.dev/cover.png" }} />,
    );
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "https://x.dev/cover.png",
    );
  });

  it("falls back to a monogram when there is no icon or cover", () => {
    const { container } = render(<ProjectIcon post={base} />);
    expect(container.textContent).toBe("Q");
  });
});
