"use client";
import { Post, Book } from "@/components/shared/Cards";
import { Categories } from "@/components/shared/Categories";
import { RiCloseLine } from "react-icons/ri";
import styles from "./styles.module.scss";

import assets from "@/assets/blur.json";
import { useQueryParams } from "@/hooks";
import { getCategories } from "@/utils/getCategories";
import { getPostsByCategory } from "@/utils/getPostsByCategory";
import { PostProps } from "@/utils/types";
import Link from "next/link";

interface QueryParams {
  category: string;
}

interface PostsSectionProps {
  type?: "blog" | "store" | "books";
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
      {posts.length > 0 ? (
        <>
          <div className={type === "books" ? styles.bodyFlex : styles.bodyGrid}>
            {queryParams.category && (
              <div className={styles.category}>
                <div className={styles.content}>
                  <p>Category</p>
                  <h1 className={styles.title}>{queryParams.category}</h1>
                </div>
                <RiCloseLine
                  onClick={() => setQueryParams({ category: "" })}
                  className={styles.icon}
                />
              </div>
            )}
            <div className={styles.posts}>
              <div
                className={
                  queryParams.category
                    ? `${styles.grid_down} ${
                        type === "books" ? styles.flex : styles.grid
                      }`
                    : `${styles.grid_up} ${
                        type === "books" ? styles.flex : styles.grid
                      }`
                }
              >
                {getPostsByCategory(queryParams.category, posts).map((item) => {
                  return (
                    <Link key={item.id} href={`/${type}/${item.post_slug}`}>
                      {type === "books" ? (
                        <Book
                          type={type}
                          post={item}
                          blurData={assets.base64}
                        />
                      ) : (
                        <Post
                          type={type}
                          post={item}
                          blurData={assets.base64}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <Categories
            type="section"
            categories={getCategories(posts).map((item) => item.title)}
            onClick={(item) => setParams(item)}
            comparator={queryParams.category}
          />
        </>
      ) : (
        <div className={styles.empty}>
          <p>No content yet...</p>
        </div>
      )}
    </main>
  );
};
