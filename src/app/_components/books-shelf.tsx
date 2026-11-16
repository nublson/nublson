import PostsSection from "@/sections/posts";
import {
  BOOK_FILTER_PROPERTIES,
  getAllPublishedPostsForFeed,
} from "@/services/notion";
import { groupBooksByStatus, type PostMetadata } from "@/utils/formatter";

/** Every published book (`State = Done`), newest `Publish Date` first. */
export async function getBooks(): Promise<PostMetadata[]> {
  return getAllPublishedPostsForFeed(
    process.env.NOTION_DATABASE_BOOKS_ID!,
    undefined,
    BOOK_FILTER_PROPERTIES,
  );
}

/** One section per reading status: Reading, Read, then any others. */
export function BooksShelf({ books }: { books: PostMetadata[] }) {
  return (
    <div data-stream className="flex w-full flex-col gap-14">
      {groupBooksByStatus(books).map(({ status, books }) => (
        <PostsSection
          key={status}
          title={status}
          id={status.toLowerCase()}
          posts={books}
          basePath="/books"
        />
      ))}
    </div>
  );
}
