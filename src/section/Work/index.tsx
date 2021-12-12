import useSWR from "swr";
import { Section } from "../../components/Layout/elements";
import Cards from "../../components/shared/molecules/Cards";
import { unsplash } from "../../services/unsplash";
import { youtube } from "../../services/youtube";
import { formatNumbers } from "../../utils/formatter";
import { Container } from "./styles";

const fetchUnsplashViews = (url: string) =>
  unsplash.get(url).then(({ data }) => {
    const value = data.views.historical.change;

    return formatNumbers(value);
  });

const fetchYoutubeSubscribers = (url: string) =>
  youtube
    .get(url, {
      params: {
        part: "statistics",
        id: "UC0kP3MzeS1re1XqQ7ebKIrA",
      },
    })
    .then(({ data }) => {
      const value = data.items[0].statistics.subscriberCount;

      return formatNumbers(value);
    });

function Work() {
  const { data: unsplashViews } = useSWR(
    "/users/nublson/statistics",
    fetchUnsplashViews
  );

  const { data: youtubeSubs } = useSWR("/channels", fetchYoutubeSubscribers);

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
          stats={`${youtubeSubs ? youtubeSubs : 0} subscribers`}
        />
        <Cards.Work
          title="Unsplash"
          description="You can see a selected collection of my photography work."
          link="https://unsplash.com/@nublson"
          stats={`${unsplashViews ? unsplashViews : 0} views/last 30 days`}
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
