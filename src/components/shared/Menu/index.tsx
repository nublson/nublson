"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./styles.module.scss";

import { getIsCurrentPath } from "@/utils/utils";

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
                getIsCurrentPath(item.path, pathname)
                  ? styles.active
                  : styles.item
              }
            >
              <Link
                href={`/${item.path}`}
                aria-disabled={
                  getIsCurrentPath(item.path, pathname) ? true : false
                }
                style={{
                  pointerEvents: getIsCurrentPath(item.path, pathname)
                    ? "none"
                    : "all",
                  cursor: getIsCurrentPath(item.path, pathname)
                    ? "none"
                    : "pointer",
                }}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
