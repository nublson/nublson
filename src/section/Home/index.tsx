import dynamic from "next/dynamic";
import { HTMLAttributes } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { Container, ScrollLink } from "./styles";

const Heading = dynamic(
  () => import("../../components/shared/molecules/Heading")
);

interface HomeProps extends HTMLAttributes<HTMLDivElement> {
  top?: string;
  title: string;
  subtitle?: string;
  image?: string | StaticImageData;
  scrollTo?: string;
  article?: boolean;
}

function Home({
  top,
  title,
  subtitle,
  image,
  scrollTo,
  article,
  ...rest
}: HomeProps) {
  return (
    <Container article={article} {...rest}>
      <Heading
        top={top}
        title={title}
        subtitle={subtitle}
        image={image}
        article={article}
      />
      {!article &&
        (scrollTo ? (
          <ScrollLink
            href={`#${scrollTo}`}
            to={scrollTo}
            spy={true}
            smooth={true}
            duration={1000}
            name="scroll-down-icon"
          >
            <RiArrowDownSLine size={30} color="#FCFCFC" />
          </ScrollLink>
        ) : null)}
    </Container>
  );
}

export default Home;
