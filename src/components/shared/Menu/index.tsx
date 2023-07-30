"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./styles.module.scss";

interface MenuProps {
  items: {
    name: string;
    path: string;
  }[];
}

export const Menu = ({ items }: MenuProps) => {
  const pathname = usePathname();

  return (
    <nav>
      <ul className={styles.list}>
        {items.map((item, index) => {
          return (
            <li
              key={index}
              className={
                pathname.startsWith(`/${item.path}`)
                  ? styles.active
                  : styles.item
              }
            >
              <Link href={`/${item.path}`}>{item.name}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
