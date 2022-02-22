import { Render } from "@9gustin/react-notion-render";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { StyledBlocks } from "../../styles/notion";
import { IGumroadButtonProps, ISectionProps } from "../../utils/types";
import { Container } from "./styles";

const ArticleSection = dynamic<ISectionProps>(() =>
  import("../../components/Layout/elements").then(
    (module) => module.ArticleSection
  )
);
const GumroadButton = dynamic<IGumroadButtonProps>(() =>
  import("../../components/shared/molecules/Buttons").then(
    (module) => module.GumroadButton
  )
);
const KitFrame = dynamic(
  () => import("../../components/shared/molecules/KitIframe")
);
const PodcastFrame = dynamic(
  () => import("../../components/shared/molecules/PodcastIframe")
);

const MembersOnly = dynamic(
  () => import("../../components/shared/molecules/MembersOnly")
);

interface ContentProps {
  blocks: any[];
  url?: string;
  member_link?: string;
  podcast_slug?: string;
  access?: "public" | "member_free" | "member_exclusive";
}

function Content({
  blocks,
  url,
  member_link,
  podcast_slug,
  access,
}: ContentProps) {
  const { pathname } = useRouter();

  return (
    <ArticleSection>
      <Container>
        <StyledBlocks>
          {url && pathname.includes("store") && (
            <GumroadButton productUrl={url} />
          )}
          {access !== "public" && (
            <MembersOnly
              member_link={
                member_link
                  ? member_link
                  : "https://www.buymeacoffee.com/nublson"
              }
              access={access ? access : "public"}
            />
          )}
          <Render blocks={blocks} simpleTitles classNames />
          {url && pathname.includes("gears") && <KitFrame url={url} />}
          {podcast_slug && pathname.includes("podcast") && (
            <PodcastFrame slug={podcast_slug} />
          )}
        </StyledBlocks>
      </Container>
    </ArticleSection>
  );
}

export default Content;
