import { useEffect, useState } from "react";
import { Section } from "../../components/Layout/elements";
import { Cards } from "../../components/shared/molecules";
import { getUnsplashViews } from "../../services/unsplash";
import { getYoutubeSubscriptions } from "../../services/youtube";
import { formatNumbers } from "../../utils/formatter";
import { Container } from "./styles";

function Work() {
  const [unsplashViews, setUnsplashViews] = useState<string | number>(0);
  const [youtubeSubs, setYoutubeSubs] = useState<string | number>(0);

  useEffect(() => {
    getUnsplashViews().then((response) => {
      const convertedValue = formatNumbers(response);
      setUnsplashViews(convertedValue);
    });
  }, [unsplashViews]);

  useEffect(() => {
    getYoutubeSubscriptions().then((response) => {
      const convertedValue = formatNumbers(response);
      setYoutubeSubs(convertedValue);
    });
  }, [youtubeSubs]);

  return (
    <Section
      id="work"
      title="Working every day with everything I like the most."
    >
      <Container>
        <Cards.Work
          title="Instagram"
          description="My daily life as a content creator and partnerships with different brands."
          link="https://instagram.com/nublson"
          stats="2.7K followers"
        />
        <Cards.Work
          title="Youtube"
          description="I'm also diving into the world of video creation. Videos about technology, photography and lifestyle."
          link="https://www.youtube.com/channel/UC0kP3MzeS1re1XqQ7ebKIrA"
          stats={`${youtubeSubs} subscribers`}
        />
        <Cards.Work
          title="Unsplash"
          description="You can see a selected collection of my photography work."
          link="https://unsplash.com/@nublson"
          stats={`${unsplashViews} views/last 30 days`}
        />
        <Cards.Work
          title="Online Store"
          description="A collection of my best selling digital products. Made by me, with love."
          link="https://gumroad.com/nublson"
          stats={`${formatNumbers(1104)} sells`}
        />
      </Container>
    </Section>
  );
}

export default Work;
