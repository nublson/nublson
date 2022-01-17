import { useState } from "react";
import { Section } from "../../components/Layout/elements";
import Text from "../../components/shared/atoms/Texts";
import { Issue } from "../../components/shared/molecules/Cards";
import { Container } from "./styles";

function Issues() {
  const [issues, setIssues] = useState([]);

  return (
    <Section id="issues">
      <Container>
        {issues.length ? (
          issues.map((issue, index) => (
            <Issue
              key={index}
              title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Netus tempor amet tellus non odio adipiscing mattis. Molestie tincidunt nibh tempus sit nunc neque, aliquet tempor, blandit."
              publish_date="January 16, 2022"
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
