import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

import Link from "next/link";
import styles from "./styles.module.scss";

export const NavComponent = () => {
  return (
    <div className={styles.container}>
      <Link className={styles.navButton} href={"/"}>
        <RiArrowLeftSLine className={styles.icon} />
      </Link>
      <Link className={styles.navButton} href={"/"}>
        <RiArrowRightSLine className={styles.icon} />
      </Link>
    </div>
  );
};
