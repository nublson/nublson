import { Render } from "@9gustin/react-notion-render";
import { useRouter } from "next/router";
import { ArticleSection } from "../../components/Layout/elements";
import ShareLink from "../../components/shared/atoms/ShareLink";
import Texts from "../../components/shared/atoms/Texts";
import { StyledBlocks } from "../../styles/notion";
import { Container, ShareContent } from "./styles";

interface ContentProps {
  blocks: any[];
}

function Content({ blocks }: ContentProps) {
  const { asPath, pathname } = useRouter();

  return (
    <ArticleSection>
      <Container>
        <StyledBlocks>
          <Render blocks={blocks} classNames emptyBlocks />
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
