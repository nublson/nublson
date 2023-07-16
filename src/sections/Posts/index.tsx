"use client";
import { Post } from "@/components/shared/Cards";
import { Categories } from "@/components/shared/Categories";
import styles from "./styles.module.scss";

import { useQueryParams } from "@/hooks";
import { getCategories } from "@/utils/getCategories";
import { getPostsByCategory } from "@/utils/getPostsByCategory";
import { PostProps } from "@/utils/types";

interface QueryParams {
  category: string;
}

interface PostsSectionProps {
  type: "articles" | "products";
  posts: PostProps[];
}

export const PostsSection = ({ type, posts }: PostsSectionProps) => {
  const { queryParams, setQueryParams } = useQueryParams<QueryParams>();

  const setParams = (value: string) => {
    if (queryParams.category === value) {
      setQueryParams({ category: "" });
    } else {
      setQueryParams({ category: value });
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.posts}>
        {queryParams.category && (
          <div className={styles.category}>
            <p>Category</p>
            <h1 className={styles.title}>{queryParams.category}</h1>
          </div>
        )}

        <div
          className={queryParams.category ? styles.grid_down : styles.grid_up}
        >
          {getPostsByCategory(queryParams.category, posts).map(
            (item, index) => {
              return <Post type={type} key={index} post={item} />;
            }
          )}
        </div>
      </div>
      <Categories
        type="section"
        categories={getCategories(posts).map((item) => item.title)}
        onClick={(item) => setParams(item)}
        comparator={queryParams.category}
      />
    </main>
  );
};
