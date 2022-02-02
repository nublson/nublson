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

interface ContentProps {
  blocks: any[];
  product_url?: string;
}

function Content({ blocks, product_url }: ContentProps) {
  const { pathname } = useRouter();

  return (
    <ArticleSection>
      <Container>
        <StyledBlocks>
          {product_url && pathname.includes("store") && (
            <GumroadButton productUrl={product_url} />
          )}
          <Render blocks={blocks} simpleTitles classNames emptyBlocks />
          {pathname === "/gears" && product_url && (
            <KitFrame kitUrl={product_url} />
          )}
        </StyledBlocks>
      </Container>
    </ArticleSection>
  );
}

export default Content;
