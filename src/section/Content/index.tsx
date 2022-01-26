import { Render } from "@9gustin/react-notion-render";
import { useRouter } from "next/router";
import { ArticleSection } from "../../components/Layout/elements";
import { GumroadButton } from "../../components/shared/molecules/Buttons";
import KitFrame from "../../components/shared/molecules/KitIframe";
import { StyledBlocks } from "../../styles/notion";
import { Container } from "./styles";

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
          {product_url && pathname !== "/gears" && (
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
