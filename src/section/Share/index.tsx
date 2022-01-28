import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ISectionProps, ITextsProps } from "../../utils/types";
import { Container } from "./styles";

const Section = dynamic<ISectionProps>(() =>
  import("../../components/Layout/elements").then((module) => module.Section)
);
const ShareLink = dynamic(
  () => import("../../components/shared/atoms/ShareLink")
);
const MediumText = dynamic<ITextsProps>(() =>
  import("../../components/shared/atoms/Texts").then(
    (module) => module.MediumText
  )
);
const SmallText = dynamic<ITextsProps>(() =>
  import("../../components/shared/atoms/Texts").then(
    (module) => module.SmallText
  )
);

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
