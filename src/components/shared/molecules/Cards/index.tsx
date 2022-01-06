import Image from "next/image";
import {
  RiInstagramLine,
  RiStoreLine,
  RiUnsplashLine,
  RiYoutubeLine,
  RiGithubLine,
  RiGlobalLine,
} from "react-icons/ri";
import { formatDate } from "../../../../utils/formatter";
import Texts from "../../atoms/Texts";
import Titles from "../../atoms/Titles";
import {
  BlogContainer,
  Thumbnail,
  WorkContainer,
  ViewsContainer,
} from "./styles";

interface CardsProps {
  title: string;
  description?: string;
}

interface WorkCard extends CardsProps {
  id: string;
  link: string;
  stats: string;
}

interface BlogCard extends CardsProps {
  thumbnail: string | StaticImageData;
  publish_date: string;
  read_time: number;
  slug: string;
}

function Work({ id, title, description, link, stats }: WorkCard) {
  return (
    <WorkContainer href={link} target="_blank" rel="noreferrer">
      {id === "instagram" ? (
        <RiInstagramLine className="icon" />
      ) : id === "youtube" ? (
        <RiYoutubeLine className="icon" />
      ) : id === "unsplash" ? (
        <RiUnsplashLine className="icon" />
      ) : id === "store" ? (
        <RiStoreLine className="icon" />
      ) : id === "github" ? (
        <RiGithubLine className="icon" />
      ) : (
        <RiGlobalLine className="icon" />
      )}
      <div className="body">
        <div className="content">
          <Titles.Small content={title} />
          {description && <Texts.Medium content={description} />}
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
  slug,
}: BlogCard) {
  return (
    <BlogContainer>
      <Thumbnail>
        <ViewsContainer>
          <Texts.XSmall content={`${0} views`} />
        </ViewsContainer>
        <Image
          src={thumbnail}
          alt="Thumbnail"
          objectFit="cover"
          layout="fill"
          priority={true}
        />
      </Thumbnail>
      <div className="data">
        <div className="heading">
          <Titles.Small content={title} />
          {description && <Texts.Medium content={description} />}
        </div>

        <div className="footer">
          <Texts.XSmall content={formatDate(publish_date)} />
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
