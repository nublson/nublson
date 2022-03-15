import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useIssue } from "../../hooks/useNewsletter";
import { IIssueCard, ISectionProps, ITextsProps } from "../../utils/types";
import { Container } from "./styles";

const Section = dynamic<ISectionProps>(() =>
  import("../../components/Layout/elements").then((module) => module.Section)
);
const IssueCard = dynamic<IIssueCard>(() =>
  import("../../components/shared/molecules/Cards").then(
    (module) => module.Issue
  )
);
const SmallText = dynamic<ITextsProps>(() =>
  import("../../components/shared/atoms/Texts").then(
    (module) => module.SmallText
  )
);

function Issues() {
  const issues = useIssue();

  return (
    <Section id="issues">
      <Container>
        {issues && issues.length ? (
          issues.map((issue) => (
            <IssueCard
              key={issue.id}
              title={issue.title}
              description={issue.description}
              publish_date={issue.publish_date}
            />
          ))
        ) : (
          <div className="feedback">
            <SmallText content="No current issues. Subscribe to the newsletter to receive in advance." />
          </div>
        )}
      </Container>
    </Section>
  );
}

export default Issues;
