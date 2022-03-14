import Image from "next/image";
import { IImageGridProps } from "../../../../utils/types";
import { Container, Figure } from "./styles";

function ImageGrid({ gallery }: IImageGridProps) {
  return (
    <Container>
      {gallery.map((image) => (
        <Figure key={image.id}>
          <Image
            src={image.url}
            alt={image.alt}
            width={image.width}
            height={image.height}
            objectFit="cover"
          />
        </Figure>
      ))}
    </Container>
  );
}

export default ImageGrid;
