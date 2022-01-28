import { FormHandles, SubmitHandler } from "@unform/core";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { filterPostsByCategory } from "../../utils/filterPosts";
import { getCategories } from "../../utils/getCategories";
import {
  IBlogCard,
  IBlogCategory,
  IBlogItem,
  IButtonIconProps,
  ISectionProps,
  ITextsProps,
} from "../../utils/types";
import {
  ArticleList,
  CategorySection,
  Container,
  Header,
  StyledForm,
} from "./styles";

const Section = dynamic<ISectionProps>(() =>
  import("../../components/Layout/elements").then((module) => module.Section)
);
const CategoryItem = dynamic(
  () => import("../../components/shared/atoms/CategoryItem")
);
const RouteLink = dynamic(
  () => import("../../components/shared/atoms/RouteLink")
);
const MediumText = dynamic<ITextsProps>(() =>
  import("../../components/shared/atoms/Texts").then(
    (module) => module.MediumText
  )
);
const IconButton = dynamic<IButtonIconProps>(() =>
  import("../../components/shared/molecules/Buttons").then(
    (module) => module.IconButton
  )
);
const Blog = dynamic<IBlogCard>(
  () =>
    import("../../components/shared/molecules/Cards").then(
      (module) => module.Blog
    ),
  { ssr: true }
);
const Input = dynamic(() => import("../../components/shared/molecules/Input"));

interface FormData {
  search: string;
}

interface ArticlesProps {
  posts: IBlogItem[];
}

function Articles({ posts }: ArticlesProps) {
  const [categories, setCategories] = useState<IBlogCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<IBlogItem[]>([]);
  const formRef = useRef<FormHandles>(null);
  const { pathname } = useRouter();

  const handleSubmit: SubmitHandler<FormData> = (data, { reset }) => {
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
            <IconButton icon={<RiSearchLine size="24" color="#020202" />} />
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
            <MediumText content="No items found!" />
          ) : (
            filteredPosts.map((article) => (
              <RouteLink key={article.id} href={`${pathname}/${article.slug}`}>
                <Blog
                  thumbnail={article.thumbnail}
                  title={article.title}
                  description={article.description}
                  publish_date={article.publish_date}
                  read_time={article.read_time}
                  slug={article.slug}
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
