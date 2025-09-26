import menu from "@/utils/menu.json";
import Image from "next/image";
import styles from "./styles.module.scss";

import { Menu } from "../Menu";

import logo from "@/assets/logo_white.svg";
import Link from "next/link";

export const Header = () => {
  return (
    <header className={styles.container}>
      <div className={styles.left}>
        <Link href={"/"}>
          <Image src={logo} alt="nubl. logo" className={styles.logo} />
        </Link>
        <Menu items={menu.header} color="white" />
      </div>
    </header>
  );
};
