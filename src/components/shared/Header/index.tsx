import Image from "next/image";
import { RiSunFill } from "react-icons/ri";
import styles from "./styles.module.scss";

import menu from "@/utils/menu.json";

import { PrimaryIcon, PrimaryText } from "../Buttons";
import { Menu } from "../Menu";

import logo from "@/assets/logo_white.svg";
import Link from "next/link";

export const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Link href={"/"}>
          <Image src={logo} alt="nubl. logo" width={50} height={50} />
        </Link>
        <Menu items={menu.items} />
      </div>
      <div className={styles.right}>
        <a href="https://nublson.substack.com" target="_blank">
          <PrimaryText title="Newsletter" />
        </a>
        <PrimaryIcon icon={<RiSunFill size={"24px"} />} />
      </div>
    </div>
  );
};
