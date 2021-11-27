import Image from "next/image";
import { ReactNode } from "react";
import { Texts, Titles } from "../../atoms";
import { BlogContainer, Thumbnail, WorkContainer } from "./styles";
import moment from "moment";

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
  thumbnail: string | StaticImageData;
  publish_date: string;
  read_time: number;
}

function Work({ title, description, link, stats, icon }: WorkCard) {
  return (
    <WorkContainer href={link} target="_blank" rel="noreferrer">
      {icon}
      <div className="body">
        <div className="content">
          <Titles.Small content={title} />
          <Texts.Medium content={description} />
        </div>

        <div className="footer">
          <Texts.Small content="Visit" />
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
          <Texts.XSmall content={moment(publish_date).format("MMMM D, YYYY")} />
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
