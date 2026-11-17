import { BookList } from "@/components/book-list";
import { BookReading } from "@/components/book-reading";
import { BookStrip } from "@/components/book-strip";
import { SectionWrapper } from "@/components/section-wrapper";
import {
  getAllPublishedPostsForFeed,
  type PublishedPageSort,
} from "@/services/notion";
import { groupBooksByStatus, type PostMetadata } from "@/utils/formatter";

/**
 * The books' own fields. Notion returns only what's requested (so `Status`,
 * `ISBN` and `Featured` must be here) and answers 400 for a field that
 * doesn't exist (so nothing books don't use, like `Category`).
 */
const BOOK_FILTER_PROPERTIES = [
  "title",
  "Description",
  "Path",
  "Author",
  "Status",
  "ISBN",
  "Featured",
];

/**
 * Most recently read first (books without a `Read Date` go last), then A to
 * Z by title; `groupBooksByStatus` keeps this order within a section.
 */
const BOOK_SORTS: PublishedPageSort[] = [
  { property: "Read Date", direction: "descending" },
  { property: "Name", direction: "ascending" },
];

/** Every published book (`State = Done`), most recently read first. */
export async function getBooks(): Promise<PostMetadata[]> {
  return getAllPublishedPostsForFeed(
    process.env.NOTION_DATABASE_BOOKS_ID!,
    undefined,
    BOOK_FILTER_PROPERTIES,
    BOOK_SORTS,
  );
}

/**
 * One section per reading status: what's being read as large rows ("Reading
 * now"), read books in a sideways row, then any other status (Wishlist) as a
 * compact list.
 */
export function BooksShelf({ books }: { books: PostMetadata[] }) {
  return (
    <div data-stream className="flex w-full flex-col gap-14">
      {groupBooksByStatus(books).map(({ status, books }) => {
        const id = status.toLowerCase();
        if (status === "Reading") {
          return (
            <SectionWrapper key={status} title="Reading now" id={id}>
              <BookReading books={books} />
            </SectionWrapper>
          );
        }
        if (status === "Read") {
          return <BookStrip key={status} title={status} id={id} books={books} />;
        }
        return (
          <SectionWrapper key={status} title={status} id={id}>
            <BookList books={books} />
          </SectionWrapper>
        );
      })}
    </div>
  );
}
