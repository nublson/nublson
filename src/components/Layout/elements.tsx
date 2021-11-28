import { ReactNode, HTMLAttributes } from "react";
import styled from "styled-components";

import { Titles } from "../shared/atoms";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: ReactNode;
}

const StyledSection = styled.section`
  width: 100%;
  height: 100%;
  padding: 15rem 0 5rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    max-width: 60%;
    margin: 0 auto 10rem;
    text-align: center;
  }
`;

const StyledArticle = styled(StyledSection)`
  padding-top: 10rem;
`;

const SectionContent = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Section = ({ title, children, ...rest }: SectionProps) => {
  return (
    <StyledSection {...rest}>
      {title && <Titles.Medium content={title} />}
      <SectionContent>{children}</SectionContent>
    </StyledSection>
  );
};

export const ArticleSection = ({ children, ...rest }: SectionProps) => {
  return (
    <StyledArticle {...rest}>
      <SectionContent>{children}</SectionContent>
    </StyledArticle>
  );
};
