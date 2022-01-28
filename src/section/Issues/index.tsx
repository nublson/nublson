import dynamic from "next/dynamic";
import {
  IIssueCard,
  IIssueItem,
  ISectionProps,
  ITextsProps,
} from "../../utils/types";
import { Container } from "./styles";

const Section = dynamic<ISectionProps>(() =>
  import("../../components/Layout/elements").then((module) => module.Section)
);
const Issue = dynamic<IIssueCard>(() =>
  import("../../components/shared/molecules/Cards").then(
    (module) => module.Issue
  )
);
const SmallText = dynamic<ITextsProps>(() =>
  import("../../components/shared/atoms/Texts").then(
    (module) => module.SmallText
  )
);

interface IssuesProps {
  issues: IIssueItem[];
}

function Issues({ issues }: IssuesProps) {
  return (
    <Section id="issues">
      <Container>
        {issues.length ? (
          issues.map((issue) => (
            <Issue
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
