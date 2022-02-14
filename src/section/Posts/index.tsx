import { FormHandles, SubmitHandler } from "@unform/core";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { MediumTitle } from "../../components/shared/atoms/Titles";
import {
  filterPostsByCategory,
  filterPostsByTitle,
} from "../../utils/filterPosts";
import { getCategories } from "../../utils/getCategories";
import {
  IButtonIconProps,
  IPostCard,
  IPostCategory,
  IPostItem,
  ISectionProps,
  ITextsProps,
} from "../../utils/types";
import { CategorySection, Container, Header, PostList } from "./styles";

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
const Post = dynamic<IPostCard>(
  () =>
    import("../../components/shared/molecules/Cards").then(
      (module) => module.Post
    ),
  { ssr: true }
);
const Input = dynamic(() => import("../../components/shared/molecules/Input"));

interface FormData {
  search: string;
}

interface ArticlesProps {
  posts: IPostItem[];
}

function Articles({ posts }: ArticlesProps) {
  const [categories, setCategories] = useState<IPostCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<IPostItem[]>([]);
  const formRef = useRef<FormHandles>(null);
  const { pathname } = useRouter();

  const handleSubmit: SubmitHandler<FormData> = (data, { reset }) => {
    const searchPosts = filterPostsByTitle(data.search, filteredPosts);

    setFilteredPosts(searchPosts);

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
    <Section id="posts">
      <Container>
        <Header>
          {posts.length && categories.length ? (
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

        <PostList center={filteredPosts.length <= 1}>
          {!posts.length ? (
            <MediumText content="No items found!" />
          ) : (
            filteredPosts.map((article) => (
              <RouteLink
                key={article.id}
                href={`${pathname}/${article.page_slug}`}
              >
                <Post
                  thumbnail={article.thumbnail}
                  title={article.title}
                  description={article.description}
                  publish_date={article.publish_date}
                  amount={article.amount}
                  slug={article.page_slug}
                />
              </RouteLink>
            ))
          )}
        </PostList>
      </Container>
    </Section>
  );
}

export default Articles;
