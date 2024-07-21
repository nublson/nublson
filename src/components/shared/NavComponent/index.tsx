import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

import Link from "next/link";
import styles from "./styles.module.scss";

interface NavComponentProps {
  hasMore: boolean;
  pageNumber: number;
}

export const NavComponent = ({ hasMore, pageNumber }: NavComponentProps) => {
  return (
    <div className={styles.container}>
      <Link
        className={pageNumber === 1 ? styles.disabledButton : styles.navButton}
        href={`/blog/${pageNumber - 1}`}
      >
        <RiArrowLeftSLine className={styles.icon} />
      </Link>
      <Link
        className={hasMore ? styles.navButton : styles.disabledButton}
        href={`/blog/${pageNumber + 1}`}
      >
        <RiArrowRightSLine className={styles.icon} />
      </Link>
    </div>
  );
};
