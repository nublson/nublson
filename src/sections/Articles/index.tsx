import Section from "@/components/Layout/Section";
import { RiArrowRightLine } from "react-icons/ri";

import Link from "next/link";
import styles from "./styles.module.scss";

import articlesMock from "@/mocks/articles.json";
import Image from "next/image";
import { Article } from "@/components/shared/Cards";

export const Articles = () => {
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
