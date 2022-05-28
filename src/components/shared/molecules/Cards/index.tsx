import { htmlToText } from "html-to-text";
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
  RiMicLine,
  RiRoadMapLine,
  RiStoreLine,
  RiUnsplashLine,
  RiYoutubeLine,
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
  return !external ? (
    <RouteLink href={path}>
      <WorkContainer>
        {id === "store" ? (
          <RiStoreLine className="icon" />
        ) : id === "blog" ? (
          <RiArticleLine className="icon" />
        ) : id === "podcast" ? (
          <RiMicLine className="icon" />
        ) : id === "photography" ? (
          <RiCameraLine className="icon" />
        ) : id === "newsletter" ? (
          <RiRoadMapLine className="icon" />
        ) : (
          <RiGlobalLine className="icon" />
        )}
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
        {id === "instagram" ? (
          <RiInstagramLine className="icon" />
        ) : id === "youtube" ? (
          <RiVidiconLine className="icon" />
        ) : id === "unsplash" ? (
          <RiUnsplashLine className="icon" />
        ) : id === "support" ? (
          <RiCupLine className="icon" />
        ) : id === "github" ? (
          <RiGithubLine className="icon" />
        ) : (
          <RiGlobalLine className="icon" />
        )}
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

    if (pathname === "/podcast") {
      setPostType("podcast");
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
          {description && (
            <MediumText
              content={
                description.length > 108
                  ? formatString(description, 105)
                  : description
              }
            />
          )}
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
          <SmallTitle
            content={title.length > 36 ? formatString(title, 36) : title}
          />
          {description && (
            <MediumText
              content={
                htmlToText(description).length > 65
                  ? formatString(htmlToText(description), 68)
                  : htmlToText(description)
              }
            />
          )}
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
        {description && (
          <MediumText
            content={
              htmlToText(description).length > 65
                ? formatString(htmlToText(description), 68)
                : htmlToText(description)
            }
          />
        )}
      </div>

      <div className="footer">
        <SmallText content={`${categories.map((item) => item.name)}`} />
        <SmallText content={`By ${author}`} />
      </div>
    </IssueContainer>
  );
}
