import { Section } from "../../components/Layout/elements";
import { MainButton } from "../../components/shared/molecules/Buttons";
import { Container, StyledLink } from "./styles";

function Contact() {
  return (
    <Section id="contact" title="Have a project in mind? Let's work together.">
      <Container>
        <StyledLink href="mailto: me@nublson.com">
          <MainButton title="Let's talk" />
        </StyledLink>
      </Container>
    </Section>
  );
}

export default Contact;
