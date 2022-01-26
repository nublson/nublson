import { Render } from "@9gustin/react-notion-render";
import { ArticleSection } from "../../components/Layout/elements";
import Button from "../../components/shared/molecules/Buttons";
import { StyledBlocks } from "../../styles/notion";
import { Container } from "./styles";

interface ContentProps {
  blocks: any[];
  product_url?: string;
}

function Content({ blocks, product_url }: ContentProps) {
  return (
    <ArticleSection>
      <Container>
        <StyledBlocks>
          {product_url && <Button.Gumroad productUrl={product_url} />}
          <Render blocks={blocks} simpleTitles classNames emptyBlocks />
        </StyledBlocks>
      </Container>
    </ArticleSection>
  );
}

export default Content;
