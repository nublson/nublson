import { ReactNode, HTMLAttributes } from "react";
import { IconContext } from "react-icons";
import { Texts, Titles } from "../../atoms";
import { BlogContainer, WorkContainer, Thumbnail } from "./styles";

import Image from "next/image";

interface CardsProps {
  title: string;
  description: string;
}

interface WorkCard extends CardsProps {
  link: string;
  stats: string;
  icon: ReactNode;
}

interface BlogCard extends CardsProps {
  thumbnail: StaticImageData;
  publish_date: string;
  read_time: number;
}

function Work({ title, description, link, stats, icon }: WorkCard) {
  return (
    <WorkContainer href={link} target="_blank" rel="noreferrer">
      <IconContext.Provider
        value={{
          color: "#fcfcfc",
          size: "40",
        }}
      >
        {icon}
      </IconContext.Provider>
      <div className="body">
        <div className="content">
          <Titles.Small content={title} />
          <Texts.Medium content={description} />
        </div>

        <div className="footer">
          <a className="link" href={link} target="_blank" rel="noreferrer">
            <Texts.Small content="Visit" />
          </a>
          <Texts.Small content={stats} />
        </div>
      </div>
    </WorkContainer>
  );
}

function Blog({
  thumbnail,
  title,
  description,
  publish_date,
  read_time,
}: BlogCard) {
  return (
    <BlogContainer>
      <Thumbnail>
        <Image
          src={thumbnail}
          alt="Thumbnail"
          objectFit="cover"
          layout="fill"
        />
      </Thumbnail>
      <div className="data">
        <div className="heading">
          <Titles.Small content={title} />
          <Texts.Medium content={description} />
        </div>

        <div className="footer">
          <Texts.XSmall content={publish_date} />
          <Texts.XSmall content={`${read_time} min read`} />
        </div>
      </div>
    </BlogContainer>
  );
}

const Cards = {
  Work,
  Blog,
};

export default Cards;
