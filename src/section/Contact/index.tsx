import { Section } from "../../components/Layout/elements";
import Buttons from "../../components/shared/molecules/Buttons";
import { Container, StyledLink } from "./styles";

function Contact() {
  return (
    <Section id="contact" title="Have a project in mind? Let's work together.">
      <Container>
        <StyledLink href="mailto: me@nublson.com">
          <Buttons.Main title="Let's talk" />
        </StyledLink>
      </Container>
    </Section>
  );
}

export default Contact;
