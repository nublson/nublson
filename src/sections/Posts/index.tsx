import { PrimaryIcon } from "@/components/shared/Buttons";
import { Article } from "@/components/shared/Cards";
import { articles } from "@/mocks";
import styles from "./styles.module.scss";
import { RiArrowRightLine } from "react-icons/ri";

export const PostsSection = () => {
  return (
    <main className={styles.container}>
      <div className={styles.posts}>
        <div className={styles.grid}>
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
          <p>Finances</p>
          <p>Lifestyle</p>
          <p>Productivity</p>
          <p>Presets</p>
          <p>Products</p>
          <p>Reviews</p>
          <p>Self Improvement</p>
          <p>Tech</p>
        </div>
      </aside>
    </main>
  );
};
