import useSWR from "swr";
import { Section } from "../../components/Layout/elements";
import { Work as WorkCard } from "../../components/shared/molecules/Cards";
import { githubFetcher } from "../../services/github";
import { unsplashFetcher } from "../../services/unsplash";
import { youtubeFetcher } from "../../services/youtube";
import { formatNumbers } from "../../utils/formatter";
import work from "../../utils/workItems.json";
import { Container } from "./styles";

function Work() {
  const { data: unsplashViews } = useSWR("nublson", unsplashFetcher, {
    refreshInterval: 3600000,
  });

  const { data: youtubeSubs } = useSWR("/channels", youtubeFetcher, {
    refreshInterval: 1000,
  });

  const { data: githubRepos } = useSWR("repos", githubFetcher, {
    refreshInterval: 1000,
  });

  const getStats = (id: string) => {
    if (id === "instagram") {
      return formatNumbers(3627);
    } else if (id === "youtube") {
      return youtubeSubs ? youtubeSubs : 0;
    } else if (id === "unsplash") {
      return unsplashViews ? unsplashViews : 0;
    } else if (id === "store") {
      return formatNumbers(1323);
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
          <WorkCard
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
