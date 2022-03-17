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

const MembersOnly = dynamic(
  () => import("../../components/shared/molecules/MembersOnly")
);

interface ContentProps {
  blocks: any[];
  url?: string;
  member_link?: string;
  access?: "public" | "member_free" | "member_exclusive";
}

function Content({ blocks, url, member_link, access }: ContentProps) {
  const { pathname } = useRouter();

  return (
    <ArticleSection>
      <Container>
        <StyledBlocks>
          {url && pathname.includes("store") && (
            <GumroadButton productUrl={url} />
          )}
          {access !== "public" && !pathname.includes("books") && (
            <MembersOnly
              member_link={
                member_link
                  ? member_link
                  : "https://www.buymeacoffee.com/nublson"
              }
              access={access ? access : "public"}
            />
          )}
          {pathname.includes("blog") && access === "member_exclusive" ? null : (
            <Render blocks={blocks} simpleTitles classNames />
          )}

          {url && pathname.includes("gears") && <KitFrame url={url} />}
        </StyledBlocks>
      </Container>
    </ArticleSection>
  );
}

export default Content;
