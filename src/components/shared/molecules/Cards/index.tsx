import Image from "next/image";
import {
  RiGithubLine,
  RiGlobalLine,
  RiInstagramLine,
  RiStoreLine,
  RiUnsplashLine,
  RiYoutubeLine,
} from "react-icons/ri";
import useSWR from "swr";
import { formatDate } from "../../../../utils/formatter";
import {
  IBlogCard,
  IIssueCard,
  IViews,
  IWorkCard,
} from "../../../../utils/types";
import { MediumText, SmallText, XSmallText } from "../../atoms/Texts";
import { SmallTitle } from "../../atoms/Titles";
import {
  BlogContainer,
  IssueContainer,
  Thumbnail,
  ViewsContainer,
  WorkContainer,
} from "./styles";

const fetcher = async (url: string) => {
  const res = await fetch(url);

  return res.json();
};

export function Work({ id, title, description, link, stats }: IWorkCard) {
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
          <SmallTitle content={title} />
          {description && <MediumText content={description} />}
        </div>

        <div className="footer">
          <SmallText content="Visit" />
          <SmallText content={stats} />
        </div>
      </div>
    </WorkContainer>
  );
}

export function Blog({
  thumbnail,
  title,
  description,
  publish_date,
  read_time,
  slug,
}: IBlogCard) {
  const { data } = useSWR<IViews>(`/api/views/${slug}`, fetcher, {
    refreshInterval: 1000,
  });

  return (
    <BlogContainer>
      <Thumbnail>
        <ViewsContainer>
          <XSmallText content={`${data?.views ? data.views : 0} views`} />
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
          <SmallTitle content={title} />
          {description && <MediumText content={description} />}
        </div>

        <div className="footer">
          <XSmallText content={formatDate(publish_date)} />
          <XSmallText content={`${read_time} min read`} />
        </div>
      </div>
    </BlogContainer>
  );
}

export function Issue({ title, description, publish_date }: IIssueCard) {
  return (
    <IssueContainer>
      <div className="content">
        <SmallTitle content={title} />
        {description && <MediumText content={description} />}
      </div>

      <div className="footer">
        <SmallText content="Subscribe to read" />
        <SmallText content={publish_date} />
      </div>
    </IssueContainer>
  );
}
