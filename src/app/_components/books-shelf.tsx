import { BookGrid } from "@/components/book-grid";
import { SectionWrapper } from "@/components/section-wrapper";
import {
  getAllPublishedPostsForFeed,
  type PublishedPageSort,
} from "@/services/notion";
import { groupBooksByStatus, type PostMetadata } from "@/utils/formatter";

/**
 * The books' own fields. Notion returns only what's requested (so `Status`
 * and `ISBN` must be here) and answers 400 for a field that doesn't exist
 * (so nothing books don't use, like `Publish Date`).
 */
const BOOK_FILTER_PROPERTIES = [
  "title",
  "Description",
  "Path",
  "Category",
  "Author",
  "Status",
  "ISBN",
];

/** A to Z by title; `groupBooksByStatus` keeps this order within a section. */
const BOOK_SORTS: PublishedPageSort[] = [
  { property: "Name", direction: "ascending" },
];

/** Every published book (`State = Done`), A to Z. */
export async function getBooks(): Promise<PostMetadata[]> {
  return getAllPublishedPostsForFeed(
    process.env.NOTION_DATABASE_BOOKS_ID!,
    undefined,
    BOOK_FILTER_PROPERTIES,
    BOOK_SORTS,
  );
}

/** One section per reading status: Reading, Read, then any others. */
export function BooksShelf({ books }: { books: PostMetadata[] }) {
  return (
    <div data-stream className="flex w-full flex-col gap-14">
      {groupBooksByStatus(books).map(({ status, books }) => (
        <SectionWrapper key={status} title={status} id={status.toLowerCase()}>
          <BookGrid books={books} />
        </SectionWrapper>
      ))}
    </div>
  );
}
