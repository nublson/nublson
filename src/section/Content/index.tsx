import { Render } from "@9gustin/react-notion-render";
import { useRouter } from "next/router";
import { ArticleSection } from "../../components/Layout/elements";
import { ShareLink, Texts } from "../../components/shared/atoms";
import { Container, ShareContent, StyledContent } from "./styles";

interface ContentProps {
  blocks: any[];
}

function Content({ blocks }: ContentProps) {
  const { asPath } = useRouter();

  return (
    <ArticleSection>
      <Container>
        <StyledContent>
          <Render blocks={blocks} classNames />
        </StyledContent>

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
      </Container>
    </ArticleSection>
  );
}

export default Content;
