import Image from "next/image";
import styles from "./styles.module.scss";
import { RiSunLine } from "react-icons/ri";

import { items } from "@/utils/menu.json";

import { Menu } from "../Menu";
import { PrimaryText, PrimaryIcon } from "../Buttons";

import logo from "@/assets/logo_white.svg";

export const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Image src={logo} alt="nubl. logo" width={50} height={50} />
        <Menu items={items} />
      </div>
      <div className={styles.right}>
        <PrimaryText title="Newsletter" />
        <PrimaryIcon icon={<RiSunLine size={"24px"} />} />
      </div>
    </div>
  );
};
