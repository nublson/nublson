import { Render } from "@9gustin/react-notion-render";
import { useRouter } from "next/router";
import { ArticleSection } from "../../components/Layout/elements";
import ShareLink from "../../components/shared/atoms/ShareLink";
import Texts from "../../components/shared/atoms/Texts";
import Button from "../../components/shared/molecules/Buttons";
import { StyledBlocks } from "../../styles/notion";
import { Container, ShareContent } from "./styles";

interface ContentProps {
  blocks: any[];
  product_url?: string;
}

function Content({ blocks, product_url }: ContentProps) {
  const { asPath, pathname } = useRouter();

  return (
    <ArticleSection>
      <Container>
        <StyledBlocks>
          {product_url && <Button.Gumroad productUrl={product_url} />}
          <Render blocks={blocks} simpleTitles classNames emptyBlocks />
        </StyledBlocks>

        {pathname !== "/about" && (
          <ShareContent>
            <Texts.Small content="Share this article on" />

            <div className="links">
              <ShareLink
                on="facebook"
                content={`${process.env.BASE_URL}${asPath}`}
              >
                <Texts.Medium content="Facebook" />
              </ShareLink>
              <ShareLink
                on="twitter"
                content={`${process.env.BASE_URL}${asPath}`}
              >
                <Texts.Medium content="Twitter" />
              </ShareLink>
              <ShareLink
                on="whatsapp"
                content={`${process.env.BASE_URL}${asPath}`}
              >
                <Texts.Medium content="Whatsapp" />
              </ShareLink>
            </div>
          </ShareContent>
        )}
      </Container>
    </ArticleSection>
  );
}

export default Content;
