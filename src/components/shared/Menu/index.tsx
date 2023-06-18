import Link from "next/link";
import styles from "./styles.module.scss";

interface MenuProps {
  items: {
    name: string;
    path: string;
  }[];
}

export const Menu = ({ items }: MenuProps) => {
  return (
    <nav className={styles.container}>
      <ul className={styles.list}>
        {items.map((item, index) => {
          return (
            <li key={index} className={styles.item}>
              <Link href={`/${item.path}`}>{item.name}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
