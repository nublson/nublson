import { BookGrid } from "@/components/book-grid";
import { SectionWrapper } from "@/components/section-wrapper";
import { groupBooksByStatus, type PostMetadata } from "@/utils/formatter";
import { getBooks } from "./books-shelf";

/** Books shown on Home. */
const HOME_BOOKS = 4;

/** The first books in shelf order: what's being read, then the newest read. */
export async function getHomeBooks(): Promise<PostMetadata[]> {
  const books = await getBooks();
  return groupBooksByStatus(books)
    .flatMap((group) => group.books)
    .slice(0, HOME_BOOKS);
}

export function HomeBooks({ books }: { books: PostMetadata[] }) {
  if (books.length === 0) return null;
  return (
    <SectionWrapper title="Books" path="/books" id="books">
      <BookGrid books={books} />
    </SectionWrapper>
  );
}
