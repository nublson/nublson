"use client";
import { Post } from "@/components/shared/Cards";
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
  type?: "articles" | "products";
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
      <div className={styles.body}>
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
            className={queryParams.category ? styles.grid_down : styles.grid_up}
          >
            {getPostsByCategory(queryParams.category, posts).map((item) => {
              if (type === "articles") {
                return (
                  <Link key={item.id} href={`/blog/${item.post_slug}`}>
                    <Post type={type} post={item} blurData={assets.base64} />
                  </Link>
                );
              } else {
                return (
                  <a
                    key={item.id}
                    href={item.path}
                    target="_blank"
                    rel="noopener"
                    aria-label={`link to ${item.title}`}
                  >
                    <Post type={type} post={item} blurData={assets.base64} />
                  </a>
                );
              }
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
    </main>
  );
};
