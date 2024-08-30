"use client";
import { Post } from "@/components/shared/Cards";
import { usePathname } from "next/navigation";
import { RiCloseLine } from "react-icons/ri";
import styles from "./styles.module.scss";

import assets from "@/assets/blur.json";
import { NavComponent } from "@/components/shared/NavComponent";
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
  allPosts: PostProps[];
  pageNumber: number;
  totalPages: number;
  hasMore: boolean;
}

export const PostsSection = ({
  type,
  posts,
  allPosts,
  pageNumber,
  totalPages,
  hasMore,
}: PostsSectionProps) => {
  const { queryParams, setCategoryParams } = useQueryParams<QueryParams>();
  const pathname = usePathname();

  // Use regex to remove the trailing page number from the pathname
  const basePathname = pathname.replace(/\/\d+$/, "");

  const filteredPosts = getPostsByCategory(
    queryParams.category,
    queryParams.category ? allPosts : posts
  );

  return (
    <section id="articles" className={styles.container}>
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
                <Link
                  key={item.id}
                  href={`${basePathname}/${item.pageNumber}/${item.post_slug}`}
                >
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

      {totalPages > 1 && !queryParams.category && (
        <NavComponent
          navigator="blog"
          hasMore={hasMore}
          pageNumber={pageNumber}
        />
      )}
    </section>
  );
};
