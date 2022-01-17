import { HTMLAttributes, ReactNode } from "react";
import styled from "styled-components";
import Texts from "../shared/atoms/Texts";
import Titles from "../shared/atoms/Titles";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
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
    padding: 5rem 2rem 3rem;
  }

  .heading {
    width: 100%;
    margin: 0 auto 10rem;
    text-align: center;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;

    &:first-child {
      width: 70%;
    }

    &:last-child {
      width: 100%;
    }

    @media ${(props) => props.theme.mediaQueries.medium} {
      margin-bottom: 8rem;

      &:first-child {
        width: 90%;
      }
    }

    @media ${(props) => props.theme.mediaQueries.small} {
      margin-bottom: 5rem;

      gap: 1rem;
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

export const Section = ({
  title,
  description,
  children,
  ...rest
}: SectionProps) => {
  return (
    <StyledSection {...rest}>
      {title && (
        <div className="heading">
          <Titles.Medium content={title} />
          {description && <Texts.Medium content={description} />}
        </div>
      )}

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
