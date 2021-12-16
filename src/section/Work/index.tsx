import useSWR from "swr";
import { Section } from "../../components/Layout/elements";
import Cards from "../../components/shared/molecules/Cards";
import { unsplash } from "../../services/unsplash";
import { youtube } from "../../services/youtube";
import { github } from "../../services/github";
import { formatNumbers } from "../../utils/formatter";
import { Container } from "./styles";
import { workItems } from "../../utils/workItems";
import { useEffect } from "react";

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
        id: "UC0kP3MzeS1re1XqQ7ebKIrA",
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
      refreshInterval: 500,
    }
  );

  const { data: youtubeSubs } = useSWR("/channels", youtubeFetcher, {
    refreshInterval: 500,
  });

  const { data: githubRepos } = useSWR("/user/repos", githubFetcher, {
    refreshInterval: 500,
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
        {workItems.map((item) => (
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
