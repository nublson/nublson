import Image from "next/image";
import styles from "./styles.module.scss";

import { items } from "@/utils/menu.json";

import { Menu } from "../Menu";

import logo from "@/assets/logo_white.svg";

export const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Image src={logo} alt="nubl. logo" width={50} height={50} />
        <Menu items={items} />
      </div>
      <div className={styles.right}>
        <p>Newsletter</p>
        <p>Dark</p>
      </div>
    </div>
  );
};
