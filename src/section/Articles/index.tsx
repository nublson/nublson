import { FormHandles, SubmitHandler } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { Section } from "../../components/Layout/elements";
import CategoryItem from "../../components/shared/atoms/CategoryItem";
import RouteLink from "../../components/shared/atoms/RouteLink";
import Texts from "../../components/shared/atoms/Texts";
import Buttons from "../../components/shared/molecules/Buttons";
import Cards from "../../components/shared/molecules/Cards";
import Input from "../../components/shared/molecules/Input";
import { filterPostsByCategory } from "../../utils/filterPosts";
import { formatSlug } from "../../utils/formatter";
import { getCategories } from "../../utils/getCategories";
import { BlogCategory, BlogItem } from "../../utils/types";
import {
  ArticleList,
  CategorySection,
  Container,
  Header,
  StyledForm,
} from "./styles";

interface FormData {
  search: string;
}

interface ArticlesProps {
  posts: BlogItem[];
}

function Articles({ posts }: ArticlesProps) {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogItem[]>([]);
  const formRef = useRef<FormHandles>(null);

  const handleSubmit: SubmitHandler<FormData> = (data, { reset }) => {
    console.log(data);

    reset();
  };

  useEffect(() => {
    const category = getCategories(posts);
    setCategories(category);
  }, [currentCategory, posts]);

  useEffect(() => {
    if (!currentCategory) {
      setFilteredPosts(posts);
    } else {
      const postsArray = filterPostsByCategory(currentCategory, posts);
      setFilteredPosts(postsArray);
    }
  }, [currentCategory, posts]);

  return (
    <Section id="articles">
      <Container>
        <Header>
          <StyledForm ref={formRef} onSubmit={handleSubmit}>
            <Input name="search" placeholder="Search" />
            <Buttons.Icon
              onClick={formRef.current?.submitForm}
              icon={<RiSearchLine size="24" color="#020202" />}
            />
          </StyledForm>

          {posts.length ? (
            <CategorySection>
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  name={category.name}
                  className={category.name === currentCategory ? "active" : ""}
                  onClick={() =>
                    setCurrentCategory(
                      category.name === currentCategory ? "" : category.name
                    )
                  }
                />
              ))}
            </CategorySection>
          ) : null}
        </Header>

        <ArticleList center={filteredPosts.length <= 1}>
          {!posts.length ? (
            <Texts.Medium content="No articles published" />
          ) : (
            filteredPosts.map((article) => (
              <RouteLink
                key={article.id}
                href={`/blog/${formatSlug(article.title)}`}
              >
                <Cards.Blog
                  thumbnail={article.thumbnail}
                  title={article.title}
                  description={article.description}
                  publish_date={article.publish_date}
                  read_time={article.read_time}
                />
              </RouteLink>
            ))
          )}
        </ArticleList>
      </Container>
    </Section>
  );
}

export default Articles;
