import { Section } from "../../components/Layout/elements";
import { Buttons } from "../../components/shared/molecules";

import { Container, StyledLink } from "./styles";

function Contact() {
  return (
    <Section title="Amet varius etiam diam, sit mauris egestas.">
      <Container>
        <StyledLink href="mailto: me@nublson.com">
          <Buttons.Main title="Let's talk" />
        </StyledLink>
      </Container>
    </Section>
  );
}

export default Contact;
