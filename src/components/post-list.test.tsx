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
});
