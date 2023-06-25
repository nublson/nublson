"use client";
import { PrimaryIcon } from "@/components/shared/Buttons";
import { Article, Product } from "@/components/shared/Cards";
import { RiArrowRightLine } from "react-icons/ri";
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
              if (type === "articles") {
                return <Article key={index} {...item} />;
              } else {
                return <Product key={index} {...item} />;
              }
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
          {getCategories(posts).map((item, index) => {
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
