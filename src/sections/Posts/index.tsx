"use client";
import { Post } from "@/components/shared/Cards";
import { usePathname } from "next/navigation";
import { RiCloseLine } from "react-icons/ri";
import styles from "./styles.module.scss";

import assets from "@/assets/blur.json";
import { useQueryParams } from "@/hooks";
import { getPostsByCategory } from "@/utils/getPostsByCategory";
import { PostProps } from "@/utils/types";
import Link from "next/link";

interface QueryParams {
  category: string;
}

interface PostsSectionProps {
  type?: "blog" | "store";
  posts: PostProps[];
}

export const PostsSection = ({ type, posts }: PostsSectionProps) => {
  const { queryParams, setCategoryParams } = useQueryParams<QueryParams>();
  const pathname = usePathname();

  const filteredPosts = getPostsByCategory(queryParams.category, posts);

  return (
    <main className={styles.container}>
      {posts.length > 0 ? (
        <div className={styles.bodyGrid}>
          {queryParams.category && (
            <div className={styles.category}>
              <div className={styles.content}>
                <p>Category</p>
                <h1 className={styles.title}>{queryParams.category}</h1>
              </div>
              <RiCloseLine
                onClick={() => setCategoryParams()}
                className={styles.icon}
              />
            </div>
          )}
          <div className={styles.posts}>
            <div
              className={
                queryParams.category
                  ? `${styles.grid_down} ${styles.grid}`
                  : `${styles.grid_up} ${styles.grid}`
              }
            >
              {filteredPosts.map((item) => (
                <Link key={item.id} href={`${pathname}/${item.post_slug}`}>
                  <Post type={type} post={item} blurData={assets.base64} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No content yet...</p>
        </div>
      )}
    </main>
  );
};
