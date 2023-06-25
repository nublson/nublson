"use client";
import { PrimaryIcon } from "@/components/shared/Buttons";
import { Article } from "@/components/shared/Cards";
import { articles } from "@/mocks";
import { RiArrowRightLine } from "react-icons/ri";
import styles from "./styles.module.scss";

import { useQueryParams } from "@/hooks";
import { PostProps } from "@/utils/types";
import { getCategories } from "@/utils/getCategories";

interface QueryParams {
  category: string;
}

export const PostsSection = () => {
  const { queryParams, setQueryParams } = useQueryParams<QueryParams>();

  const setParams = (value: string) => {
    if (queryParams.category === value) {
      setQueryParams({ category: "" });
    } else {
      setQueryParams({ category: value });
    }
  };

  const getPostsByCategory = (
    category: string | undefined,
    posts: PostProps[]
  ) => {
    if (category) {
      return posts.filter((post) => post.category === category);
    } else {
      return posts;
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
          {getPostsByCategory(queryParams.category, articles).map(
            (item, index) => {
              return <Article key={index} {...item} />;
            }
          )}

          <div className={styles.nav}>
            <PrimaryIcon icon={<RiArrowRightLine size={"24px"} />} />
          </div>
        </div>
      </div>
      <aside className={styles.categories}>
        <h3 className={styles.title}>Categories</h3>
        <div className={styles.items}>
          {getCategories(articles).map((item, index) => {
            return (
              <p
                key={index}
                onClick={() => setParams(item.title)}
                className={
                  queryParams.category === item.title
                    ? styles.active
                    : styles.item
                }
              >
                {item.title}
              </p>
            );
          })}
        </div>
      </aside>
    </main>
  );
};
