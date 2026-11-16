import { BlogBody } from "@/app/_components/blog-body";
import { BlogHero } from "@/app/_components/blog-hero";
import { BooksShelf, getBooks } from "@/app/_components/books-shelf";
import { getPageBlocks, getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import { metadataFromNotionPageId } from "@/utils/metadata";
import type { Metadata } from "next";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromNotionPageId(process.env.NOTION_PAGE_BOOKS_ID!, {
    canonical: "/books",
  });
}

export default async function BooksPage() {
  const pageId = process.env.NOTION_PAGE_BOOKS_ID!;
  const [page, pageBlocks, books] = await Promise.all([
    getPageData(pageId),
    getPageBlocks(pageId),
    getBooks(),
  ]);
  const heroMetadata = formatPageMetadata(page);

  return (
    <section className="article-layout">
      <BlogHero metadata={heroMetadata} />
      <BlogBody blocks={pageBlocks} />
      <BooksShelf books={books} />
    </section>
  );
}
