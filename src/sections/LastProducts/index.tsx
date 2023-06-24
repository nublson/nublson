import Section from "@/components/Layout/Section";
import { RiArrowRightLine } from "react-icons/ri";

import Link from "next/link";
import styles from "./styles.module.scss";

import { Product } from "@/components/shared/Cards";
import articlesMock from "@/mocks/lastProducts.json";

export const LastProducts = () => {
  return (
    <Section title="Viverra gravida odio amet nulla aliquet convallis.">
      <div className={styles.container}>
        <div className={styles.posts}>
          {articlesMock.items.map((item, index) => {
            return <Product key={index} {...item} />;
          })}
        </div>
        <Link className={styles.link} href={"/blog"}>
          Lorem
          <RiArrowRightLine />
        </Link>
      </div>
    </Section>
  );
};
