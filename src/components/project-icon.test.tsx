import type { PostMetadata } from "@/utils/formatter";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProjectIcon } from "./project-icon";

const base = { id: "1", title: "Quiver" } as PostMetadata;

afterEach(() => {
  vi.restoreAllMocks();
});

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

  it("holds a muted placeholder until the image loads, then fades it in", async () => {
    // jsdom reports every image as complete with no pixels; model one still loading.
    vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(false);
    const { container } = render(
      <ProjectIcon
        post={{ ...base, icon: { type: "image", src: "https://x.dev/i.png" } }}
      />,
    );
    const img = container.querySelector("img")!;
    expect(img.parentElement?.className).toContain("bg-muted");
    expect(img.hasAttribute("data-loaded")).toBe(false);

    fireEvent.load(img);
    await waitFor(() => expect(img.hasAttribute("data-loaded")).toBe(true));
    expect(img.parentElement?.className).not.toContain("bg-muted");
  });

  it("shows the monogram when the image fails to load", () => {
    const { container } = render(
      <ProjectIcon
        post={{ ...base, icon: { type: "image", src: "https://x.dev/i.png" } }}
      />,
    );
    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toBe("Q");
  });
});
