"use client";
import { PrimaryIcon } from "@/components/shared/Buttons";
import { Article } from "@/components/shared/Cards";
import { articles } from "@/mocks";
import { RiArrowRightLine } from "react-icons/ri";
import styles from "./styles.module.scss";

import { useQueryParams } from "@/hooks";

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
          {articles.map((item, index) => {
            return <Article key={index} {...item} />;
          })}

          <div className={styles.nav}>
            <PrimaryIcon icon={<RiArrowRightLine size={"24px"} />} />
          </div>
        </div>
      </div>
      <aside className={styles.categories}>
        <h3 className={styles.title}>Categories</h3>
        <div className={styles.items}>
          {articles.map((item, index) => {
            return (
              <p
                key={index}
                onClick={() => setParams(item.category)}
                className={
                  queryParams.category === item.category
                    ? styles.active
                    : styles.item
                }
              >
                {item.category}
              </p>
            );
          })}
        </div>
      </aside>
    </main>
  );
};
