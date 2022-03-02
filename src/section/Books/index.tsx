import dynamic from "next/dynamic";
import {
  IBookCard,
  IBookItem,
  ISectionProps,
  ITextsProps,
} from "../../utils/types";
import { Container } from "./styles";

const Section = dynamic<ISectionProps>(() =>
  import("../../components/Layout/elements").then((module) => module.Section)
);
const RouteLink = dynamic(
  () => import("../../components/shared/atoms/RouteLink")
);
const BookCard = dynamic<IBookCard>(() =>
  import("../../components/shared/molecules/Cards").then(
    (module) => module.Book
  )
);
const SmallText = dynamic<ITextsProps>(() =>
  import("../../components/shared/atoms/Texts").then(
    (module) => module.SmallText
  )
);

interface BookProps {
  books: IBookItem[];
}

function Books({ books }: BookProps) {
  return (
    <Section id="books">
      <Container>
        {books && books.length ? (
          books.map((book) => (
            <RouteLink key={book.id} href={`/books/${book.post_slug}`}>
              <BookCard
                key={book.id}
                title={book.title}
                description={book.description}
                categories={book.categories}
                author={book.author}
              />
            </RouteLink>
          ))
        ) : (
          <div className="feedback">
            <SmallText content="No current books. I am preparing and organizing the book list. Come back in a few days." />
          </div>
        )}
      </Container>
    </Section>
  );
}

export default Books;
