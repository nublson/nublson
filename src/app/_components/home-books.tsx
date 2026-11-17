import { getBooks } from "@/app/_components/books-shelf";
import { BookList } from "@/components/book-list";
import { SectionWrapper } from "@/components/section-wrapper";
import { groupBooksByStatus, type PostMetadata } from "@/utils/formatter";

const HOME_BOOK_COUNT = 4;

/**
 * The books ticked Featured in Notion, in shelf order (Reading, Read, then
 * Wishlist), four at most.
 */
export function pickHomeBooks(books: PostMetadata[]): PostMetadata[] {
  return groupBooksByStatus(books.filter((book) => book.featured))
    .flatMap((group) => group.books)
    .slice(0, HOME_BOOK_COUNT);
}

export async function getHomeBooks(): Promise<PostMetadata[]> {
  return pickHomeBooks(await getBooks());
}

export function HomeBooks({ books }: { books: PostMetadata[] }) {
  if (books.length === 0) return null;
  return (
    <SectionWrapper title="Books" path="/books" id="books">
      <BookList books={books} />
    </SectionWrapper>
  );
}
