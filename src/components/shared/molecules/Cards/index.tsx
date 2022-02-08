import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  RiGithubLine,
  RiGlobalLine,
  RiInstagramLine,
  RiStoreLine,
  RiUnsplashLine,
  RiYoutubeLine,
} from "react-icons/ri";
import { useViews } from "../../../../hooks/useViews";
import { formatDate } from "../../../../utils/formatter";
import {
  IIssueCard,
  IPostCard,
  IPostType,
  IWorkCard,
} from "../../../../utils/types";
import { MediumText, SmallText, XSmallText } from "../../atoms/Texts";
import { SmallTitle } from "../../atoms/Titles";
import {
  IssueContainer,
  PostContainer,
  Thumbnail,
  ViewsContainer,
  WorkContainer,
} from "./styles";

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

export function Post({
  thumbnail,
  title,
  description,
  publish_date,
  amount,
  slug,
}: IPostCard) {
  const views = useViews(slug);
  const { pathname } = useRouter();
  const [postType, setPostType] = useState<IPostType>("article");

  useEffect(() => {
    if (pathname === "/") {
      setPostType("article");
    }

    if (pathname === "/store") {
      setPostType("product");
    }

    if (pathname === "/podcast") {
      setPostType("podcast");
    }
  }, [pathname, postType]);

  return (
    <PostContainer>
      <Thumbnail>
        <ViewsContainer>
          <XSmallText content={`${views ? views : 0} views`} />
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
          <XSmallText
            content={`${amount} ${
              postType === "article"
                ? "min read"
                : postType === "product"
                ? "€"
                : "min audio"
            }`}
          />
        </div>
      </div>
    </PostContainer>
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
