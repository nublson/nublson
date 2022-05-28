import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { filterPostsByCategory } from "../../utils/filterPosts";
import { getCategories } from "../../utils/getCategories";
import {
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

const MediumTitle = dynamic<ITextsProps>(() =>
  import("../../components/shared/atoms/Titles").then(
    (module) => module.MediumTitle
  )
);

const Post = dynamic<IPostCard>(
  () =>
    import("../../components/shared/molecules/Cards").then(
      (module) => module.Post
    ),
  { ssr: true }
);

interface ArticlesProps {
  posts: IPostItem[];
}

function Articles({ posts }: ArticlesProps) {
  const [categories, setCategories] = useState<IPostCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<IPostItem[]>([]);
  const { pathname } = useRouter();

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
                href={`${pathname}/${article.post_slug}`}
              >
                <Post
                  thumbnail={article.thumbnail}
                  title={article.title}
                  description={article.description}
                  publish_date={article.publish_date}
                  amount={article.amount}
                  slug={article.post_slug}
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
