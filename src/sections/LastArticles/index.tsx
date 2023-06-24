import Section from "@/components/Layout/Section";
import { RiArrowRightLine } from "react-icons/ri";

import Link from "next/link";
import styles from "./styles.module.scss";

import { Article } from "@/components/shared/Cards";
import articlesMock from "@/mocks/lastArticles.json";

export const LastArticles = () => {
  return (
    <Section title="Morbi massa lectus sem sagittis adipiscing posuere neque id odio.">
      <div className={styles.container}>
        <div className={styles.posts}>
          {articlesMock.items.map((item, index) => {
            return <Article key={index} {...item} />;
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
