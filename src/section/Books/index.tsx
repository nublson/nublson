import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { filterPostsByCategory } from "../../utils/filterPosts";
import { getCategories } from "../../utils/getCategories";
import {
  IBookCard,
  IBookItem,
  IPostCategory,
  ISectionProps,
  ITextsProps,
} from "../../utils/types";
import { Container, Header, CategorySection } from "./styles";

const Section = dynamic<ISectionProps>(() =>
  import("../../components/Layout/elements").then((module) => module.Section)
);
const CategoryItem = dynamic(
  () => import("../../components/shared/atoms/CategoryItem")
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
const MediumTitle = dynamic<ITextsProps>(() =>
  import("../../components/shared/atoms/Titles").then(
    (module) => module.MediumTitle
  )
);

interface BookProps {
  books: IBookItem[];
}

function Books({ books }: BookProps) {
  const [categories, setCategories] = useState<IPostCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<IBookItem[]>([]);
  const { pathname } = useRouter();

  useEffect(() => {
    const category = getCategories(books);
    setCategories(category);
  }, [currentCategory, books]);

  useEffect(() => {
    if (!currentCategory) {
      setFilteredBooks(books);
    } else {
      const booksArray = filterPostsByCategory(currentCategory, books);
      setFilteredBooks(booksArray);
    }
  }, [currentCategory, books]);

  return (
    <Section id="books">
      <Container>
        <Header>
          {books.length && categories.length ? (
            <>
              <MediumTitle content="Categories" />
              <CategorySection>
                {categories.map((category) => (
                  <CategoryItem
                    key={category.id}
                    name={category.name}
                    className={
                      category.name === currentCategory ? "active" : ""
                    }
                    onClick={() =>
                      setCurrentCategory(
                        category.name === currentCategory ? "" : category.name
                      )
                    }
                  />
                ))}
              </CategorySection>
            </>
          ) : null}
        </Header>

        {books && books.length ? (
          filteredBooks.map((book) => (
            <RouteLink key={book.id} href={`${pathname}/${book.post_slug}`}>
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
