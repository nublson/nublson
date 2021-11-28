import { useRouter } from "next/router";
import { ArticleSection } from "../../components/Layout/elements";
import { RichText, ShareLink, Texts } from "../../components/shared/atoms";
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
          {blocks.map((item) => (
            <RichText key={item.id} content={item} />
          ))}
        </StyledContent>

        <ShareContent>
          <Texts.Small content="Share this article on" />

          <div className="links">
            <ShareLink on="facebook" content={`https://nublson.com${asPath}`}>
              <Texts.Medium content="Facebook" />
            </ShareLink>
            <ShareLink on="twitter" content={`https://nublson.com${asPath}`}>
              <Texts.Medium content="Twitter" />
            </ShareLink>
            <ShareLink on="whatsapp" content={`https://nublson.com${asPath}`}>
              <Texts.Medium content="Whatsapp" />
            </ShareLink>
          </div>
        </ShareContent>
      </Container>
    </ArticleSection>
  );
}

export default Content;
