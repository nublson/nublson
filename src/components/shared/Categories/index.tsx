import Link from "next/link";
import styles from "./styles.module.scss";

interface CategoriesProps {
  type: "section" | "scroll";
  categories: string[];
  onClick: (item: string) => void;
  comparator?: string;
}

export const Categories = ({
  type,
  categories,
  onClick,
  comparator,
}: CategoriesProps) => {
  return (
    <aside className={styles.categories}>
      <h3 className={styles.title}>Categories</h3>
      <div className={styles.items}>
        {categories.map((item, index) => {
          return type === "section" ? (
            <p
              key={index}
              onClick={() => onClick(item)}
              className={comparator === item ? styles.active : styles.item}
            >
              {item}
            </p>
          ) : (
            <Link
              href={`#${item.toLowerCase().replace(" ", "")}`}
              key={index}
              className={styles.category}
            >
              {item}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
