import dynamic from "next/dynamic";
import { IButtonsProps, ISectionProps } from "../../utils/types";
import { Container, StyledLink } from "./styles";

const Section = dynamic<ISectionProps>(() =>
  import("../../components/Layout/elements").then((module) => module.Section)
);
const MainButton = dynamic<IButtonsProps>(() =>
  import("../../components/shared/molecules/Buttons").then(
    (module) => module.MainButton
  )
);

function Contact() {
  return (
    <Section id="contact" title="Have a project in mind? Let's work together.">
      <Container>
        <StyledLink
          target="_blank"
          rel="noopener"
          href="https://calendly.com/nublson/project"
        >
          <MainButton title="Let's talk" />
        </StyledLink>
      </Container>
    </Section>
  );
}

export default Contact;
