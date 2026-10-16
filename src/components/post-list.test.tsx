import type { PostMetadata } from "@/utils/formatter";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PostList } from "./post-list";

const post = (id: string, title: string, published_date: string) =>
  ({ id, title, slug: id, published_date }) as PostMetadata;

const posts = [
  post("a", "Building in Public", "2026-06-25T15:20:00.000+01:00"),
  post("b", "Understanding AI", "2026-05-08"),
  post("c", "Older post", "2025-12-12"),
];

describe("PostList", () => {
  it("renders a flat list with compact dates and no year column", () => {
    render(<PostList posts={posts} currentYear={2026} />);
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByText("25/06")).toBeInTheDocument();
    expect(screen.getByText("12/12/25")).toBeInTheDocument();
    expect(screen.queryByText("2026")).toBeNull();
  });

  it("groups by year with dd/mm dates on the archive", () => {
    render(<PostList posts={posts} groupByYear />);
    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("12/12")).toBeInTheDocument();
  });

  it("links each row to its post", () => {
    render(<PostList posts={posts} />);
    expect(
      screen.getByRole("link", { name: "Building in Public — read post" }),
    ).toHaveAttribute("href", "/writings/a");
  });

  it("shows undated posts under a dash instead of crashing", () => {
    render(<PostList posts={[post("x", "Draft", "")]} groupByYear />);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("renders nothing for no posts", () => {
    const { container } = render(<PostList posts={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  describe("collapseAfter", () => {
    const many = (n: number) =>
      Array.from({ length: n }, (_, i) =>
        post(`p${i}`, `Post ${i}`, i < 12 ? "2026-06-01" : "2025-06-01"),
      );

    it("shows every post with no toggle at or under the limit", () => {
      const { container } = render(
        <PostList posts={many(10)} groupByYear collapseAfter={10} />,
      );
      expect(container.querySelector("details")).toBeNull();
      expect(screen.getAllByRole("link")).toHaveLength(10);
    });

    it("tucks the older posts into a toggle above the limit, keeping them in the HTML", () => {
      const { container } = render(
        <PostList posts={many(14)} groupByYear collapseAfter={10} />,
      );
      const details = container.querySelector("details");
      expect(details).not.toBeNull();
      expect(details?.querySelector("[data-show]")?.textContent).toBe(
        "Show 4 older posts",
      );
      expect(details?.querySelectorAll("a")).toHaveLength(4);
      expect(screen.getAllByRole("link", { hidden: true })).toHaveLength(14);
    });

    it("doesn't repeat a year that continues past the limit", () => {
      const { container } = render(
        <PostList posts={many(14)} groupByYear collapseAfter={10} />,
      );
      const years = [...container.querySelectorAll("[data-year]")].map(
        (el) => el.textContent,
      );
      expect(years).toEqual(["2026", "", "2025"]);
    });

    it("uses the singular for one older post", () => {
      const { container } = render(
        <PostList posts={many(11)} groupByYear collapseAfter={10} />,
      );
      expect(container.querySelector("[data-show]")?.textContent).toBe(
        "Show 1 older post",
      );
    });
  });
});
