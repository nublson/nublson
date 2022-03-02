import Image from "next/image";
import { IHeadingProps } from "../../../../utils/types";
import { LargeText, MediumText } from "../../atoms/Texts";
import { LargeTitle } from "../../atoms/Titles";
import { Container, Content, Thumbnail } from "./styles";

function Heading({ top, title, subtitle, image, article }: IHeadingProps) {
  return (
    <Container>
      <Content>
        {top && <MediumText content={top} />}
        <LargeTitle content={title} />
        {subtitle && <LargeText content={subtitle} />}
      </Content>
      {image && (
        <Thumbnail article={article}>
          <Image
            src={image}
            alt="Thumbnail"
            objectFit="cover"
            layout="fill"
            priority={true}
            quality={100}
          />
        </Thumbnail>
      )}
    </Container>
  );
}

export default Heading;
