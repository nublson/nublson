import useSWR from "swr";
import { Section } from "../../components/Layout/elements";
import Cards from "../../components/shared/molecules/Cards";
import { github } from "../../services/github";
import { unsplash } from "../../services/unsplash";
import { youtube } from "../../services/youtube";
import { formatNumbers } from "../../utils/formatter";
import work from "../../utils/workItems.json";
import { Container } from "./styles";

const unsplashFetcher = (url: string) =>
  unsplash.get(url).then(({ data }) => {
    const value = data.views.historical.change;

    return formatNumbers(value);
  });

const youtubeFetcher = (url: string) =>
  youtube
    .get(url, {
      params: {
        part: "statistics",
        id: process.env.YOUTUBE_CHANNEL_ID,
      },
    })
    .then(({ data }) => {
      const value = data.items[0].statistics.subscriberCount;

      return formatNumbers(value);
    });

const githubFetcher = (url: string) =>
  github.get(url).then(({ data }) => {
    const publicRepos = data.length;

    return formatNumbers(publicRepos);
  });

function Work() {
  const { data: unsplashViews } = useSWR(
    "/users/nublson/statistics",
    unsplashFetcher,
    {
      refreshInterval: 3600000,
    }
  );

  const { data: youtubeSubs } = useSWR("/channels", youtubeFetcher, {
    refreshInterval: 1000,
  });

  const { data: githubRepos } = useSWR("/user/repos", githubFetcher, {
    refreshInterval: 1000,
  });

  const getStats = (id: string) => {
    if (id === "instagram") {
      return formatNumbers(2800);
    } else if (id === "youtube") {
      return youtubeSubs ? youtubeSubs : 0;
    } else if (id === "unsplash") {
      return unsplashViews ? unsplashViews : 0;
    } else if (id === "store") {
      return formatNumbers(1100);
    } else if (id === "github") {
      return githubRepos ? githubRepos : 0;
    }
  };

  return (
    <Section
      id="work"
      title="Working every day with everything I like the most."
    >
      <Container>
        {work.items.map((item) => (
          <Cards.Work
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            link={item.link}
            stats={`${getStats(item.id)} ${item.stats}`}
          />
        ))}
      </Container>
    </Section>
  );
}

export default Work;
