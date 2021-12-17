import { HTMLAttributes, ReactNode } from "react";
import styled from "styled-components";
import Titles from "../shared/atoms/Titles";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: ReactNode;
}

const StyledSection = styled.section`
  width: 100%;
  height: 100%;
  padding: 10rem 0 5rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media ${(props) => props.theme.mediaQueries.medium} {
    padding: 10rem 0 3rem;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    padding: 5rem 2rem 1rem;
  }

  h2 {
    width: 70%;
    margin: 0 auto 10rem;
    text-align: center;

    @media ${(props) => props.theme.mediaQueries.medium} {
      width: 90%;

      margin-bottom: 8rem;
    }

    @media ${(props) => props.theme.mediaQueries.small} {
      width: 90%;

      margin-bottom: 5rem;
    }
  }
`;

const StyledArticle = styled(StyledSection)`
  padding-top: 0;
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
