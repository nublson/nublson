import { useRouter } from "next/router";
import { Section } from "../../components/Layout/elements";
import ShareLink from "../../components/shared/atoms/ShareLink";
import { MediumText, SmallText } from "../../components/shared/atoms/Texts";
import { Container } from "./styles";

interface ShareProps {
  title: string;
}

function Share({ title }: ShareProps) {
  const { asPath } = useRouter();

  return (
    <Section id="share">
      <Container>
        <SmallText content={title} />

        <div className="links">
          <ShareLink on="facebook" content={`${process.env.BASE_URL}${asPath}`}>
            <MediumText content="Facebook" />
          </ShareLink>
          <ShareLink on="twitter" content={`${process.env.BASE_URL}${asPath}`}>
            <MediumText content="Twitter" />
          </ShareLink>
          <ShareLink on="whatsapp" content={`${process.env.BASE_URL}${asPath}`}>
            <MediumText content="Whatsapp" />
          </ShareLink>
        </div>
      </Container>
    </Section>
  );
}

export default Share;
