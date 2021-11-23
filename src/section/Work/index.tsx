import { Container } from "./styles";
import {
  RiInstagramLine,
  RiYoutubeLine,
  RiUnsplashLine,
  RiStoreLine,
} from "react-icons/ri";

import { Section } from "../../components/Layout/elements";
import { Cards } from "../../components/shared/molecules";

function Work() {
  return (
    <Section title="Lectus vivamus nam ornare mauris lacinia.">
      <Container>
        <Cards.Work
          icon={<RiInstagramLine />}
          title="Instagram"
          description="Volutpat sed risus tristique purus justo massa tempor egestas. Arcu non diam a, justo, morbi dolor elit."
          link="https://instagram.com/nublson"
          stats="2K followers"
        />
        <Cards.Work
          icon={<RiYoutubeLine />}
          title="Youtube"
          description="Volutpat sed risus tristique purus justo massa tempor egestas. Arcu non diam a, justo, morbi dolor elit."
          link="https://www.youtube.com/channel/UC0kP3MzeS1re1XqQ7ebKIrA"
          stats="81 subscribers"
        />
        <Cards.Work
          icon={<RiUnsplashLine />}
          title="Unsplash"
          description="Volutpat sed risus tristique purus justo massa tempor egestas. Arcu non diam a, justo, morbi dolor elit."
          link="https://unsplash.com/@nublson"
          stats="7.3M views/last 30 days"
        />
        <Cards.Work
          icon={<RiStoreLine />}
          title="Online Store"
          description="Volutpat sed risus tristique purus justo massa tempor egestas. Arcu non diam a, justo, morbi dolor elit."
          link="https://gumroad.com/nublson"
          stats="927 sells"
        />
      </Container>
    </Section>
  );
}

export default Work;
