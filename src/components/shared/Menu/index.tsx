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
  color: "white" | "black";
}

export const Menu = ({ items, color }: MenuProps) => {
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
                style={{
                  color: color === "white" ? "#fcfcfc" : "#020202",
                }}
                href={`/${item.path}`}
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
