import dynamic from "next/dynamic";
import { ISectionProps } from "../../utils/types";
import { Container } from "./styles";
import pageData from "../../utils/pageData.json";

const Section = dynamic<ISectionProps>(() =>
  import("../../components/Layout/elements").then((module) => module.Section)
);
const SubscribeForm = dynamic(
  () => import("../../components/shared/molecules/NewsletterForm")
);

function Newsletter() {
  return (
    <Section
      id="newsletter"
      title="Subscribe to my newsletter"
      description={pageData.newsletter.description}
    >
      <Container>
        <SubscribeForm />
      </Container>
    </Section>
  );
}

export default Newsletter;
