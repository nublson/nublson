import dynamic from "next/dynamic";
import { useUnsplash, useYoutube } from "../../hooks/useWork";
import { formatNumbers } from "../../utils/formatter";
import { ISectionProps, IWorkCard } from "../../utils/types";
import work from "../../utils/workItems.json";
import { Container } from "./styles";

const Section = dynamic<ISectionProps>(() =>
  import("../../components/Layout/elements").then((module) => module.Section)
);
const WorkCard = dynamic<IWorkCard>(() =>
  import("../../components/shared/molecules/Cards").then(
    (module) => module.Work
  )
);

function Work() {
  const unsplashViews = useUnsplash();

  const youtubeSubs = useYoutube();

  const getStats = (id: string) => {
    if (id === "instagram") {
      return formatNumbers(process.env.INSTAGRAM_FOLLOWERS);
    } else if (id === "youtube") {
      return youtubeSubs ? youtubeSubs : 0;
    } else if (id === "unsplash") {
      return unsplashViews ? unsplashViews : 0;
    } else if (id === "store") {
      return formatNumbers(1323);
    } else if (id === "patreon") {
      return 36;
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
            path={item.path}
            stats={`${getStats(item.id)} ${item.stats}`}
            external={item.external}
          />
        ))}
      </Container>
    </Section>
  );
}

export default Work;
