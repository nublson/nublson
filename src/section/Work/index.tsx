import dynamic from "next/dynamic";
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
            external={item.external}
          />
        ))}
      </Container>
    </Section>
  );
}

export default Work;
