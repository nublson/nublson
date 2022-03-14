import dynamic from "next/dynamic";
import {
  IGalleryItem,
  IImageGridProps,
  ISectionProps,
} from "../../utils/types";
import { Container } from "./styles";

const Section = dynamic<ISectionProps>(() =>
  import("../../components/Layout/elements").then((module) => module.Section)
);

const GalleryComponent = dynamic<IImageGridProps>(
  () => import("../../components/shared/molecules/ImageGrid")
);

interface GalleryProps {
  gallery: IGalleryItem[];
}

function Gallery({ gallery }: GalleryProps) {
  return (
    <Section>
      {gallery.length && <GalleryComponent gallery={gallery} />}
    </Section>
  );
}

export default Gallery;
