import { Section } from "../../components/Layout/elements";
import Text from "../../components/shared/atoms/Texts";
import { Issue } from "../../components/shared/molecules/Cards";
import { IssueItem } from "../../utils/types";
import { Container } from "./styles";

interface IssuesProps {
  issues: IssueItem[];
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
            <Text.Small content="No current issues. Subscribe to the newsletter to receive in advance." />
          </div>
        )}
      </Container>
    </Section>
  );
}

export default Issues;
