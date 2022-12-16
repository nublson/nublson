import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  RiArticleLine,
  RiCameraLine,
  RiCupLine,
  RiGithubLine,
  RiGlobalLine,
  RiInstagramLine,
  RiNewspaperLine,
  RiStoreLine,
  RiUnsplashLine,
  RiVidiconLine,
} from "react-icons/ri";
import { useViews } from "../../../../hooks/useViews";
import { formatDate, formatString } from "../../../../utils/formatter";
import {
  IBookCard,
  IIssueCard,
  IPostCard,
  IPostType,
  IWorkCard,
} from "../../../../utils/types";
import RouteLink from "../../atoms/RouteLink";
import { MediumText, SmallText, XSmallText } from "../../atoms/Texts";
import { SmallTitle } from "../../atoms/Titles";
import {
  IssueContainer,
  PostContainer,
  ScrollLink,
  Thumbnail,
  WorkContainer,
} from "./styles";

export function Work({ id, title, description, path, external }: IWorkCard) {
  const getIcon = (iconId: string) => {
    switch (iconId) {
      case "store":
        return <RiStoreLine className="icon" />;
      case "blog":
        return <RiArticleLine className="icon" />;
      case "photography":
        return <RiCameraLine className="icon" />;
      case "newsletter":
        return <RiNewspaperLine className="icon" />;
      case "instagram":
        return <RiInstagramLine className="icon" />;
      case "youtube":
        return <RiVidiconLine className="icon" />;
      case "unsplash":
        return <RiUnsplashLine className="icon" />;
      case "community":
        return <RiCupLine className="icon" />;
      case "github":
        return <RiGithubLine className="icon" />;
      default:
        return <RiGlobalLine className="icon" />;
    }
  };

  return !external ? (
    <RouteLink href={path}>
      <WorkContainer>
        {getIcon(id)}
        <div className="body">
          <div className="content">
            <SmallTitle content={title} />
            {description && (
              <MediumText
                content={
                  description.length > 108
                    ? formatString(description, 99)
                    : description
                }
              />
            )}
          </div>
        </div>
      </WorkContainer>
    </RouteLink>
  ) : (
    <a href={path} target="_blank" rel="noreferrer">
      <WorkContainer>
        {getIcon(id)}
        <div className="body">
          <div className="content">
            <SmallTitle content={title} />
            {description && (
              <MediumText
                content={
                  description.length > 108
                    ? formatString(description, 99)
                    : description
                }
              />
            )}
          </div>
        </div>
      </WorkContainer>
    </a>
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
  }, [pathname, postType]);

  return (
    <PostContainer>
      <Thumbnail>
        <div className="views">
          <XSmallText content={`${views ? views : 0} views`} />
        </div>
        <Image
          src={thumbnail}
          alt="Thumbnail"
          objectFit="cover"
          layout="fill"
          priority={true}
          quality={100}
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
            content={`${amount} ${postType === "article" ? "min read" : "€"}`}
          />
        </div>
      </div>
    </PostContainer>
  );
}

export function Issue({ title, description, publish_date }: IIssueCard) {
  return (
    <ScrollLink
      to="newsletter"
      href="#newsletter"
      spy={true}
      smooth={true}
      duration={1000}
      name="issue"
    >
      <IssueContainer>
        <div className="content">
          <SmallTitle content={title} />
          {description && <MediumText content={description} />}
        </div>

        <div className="footer">
          <SmallText content="Read" />
          <SmallText content={publish_date} />
        </div>
      </IssueContainer>
    </ScrollLink>
  );
}

export function Book({ title, description, categories, author }: IBookCard) {
  return (
    <IssueContainer>
      <div className="content">
        <SmallTitle content={title} />
        {description && <MediumText content={description} />}
      </div>

      <div className="footer">
        <SmallText content={`${categories.map((item) => item.name)}`} />
        <SmallText content={`By ${author}`} />
      </div>
    </IssueContainer>
  );
}
