import styled from "styled-components";
import { ISectionProps } from "../../utils/types";
import { MediumText } from "../shared/atoms/Texts";
import { MediumTitle } from "../shared/atoms/Titles";

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

    h2 {
      width: 70%;
    }

    p {
      width: 100%;
    }

    @media ${(props) => props.theme.mediaQueries.medium} {
      margin-bottom: 8rem;

      h2 {
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
}: ISectionProps) => {
  return (
    <StyledSection {...rest}>
      {title && (
        <div className="heading">
          <MediumTitle content={title} />
          {description && <MediumText content={description} />}
        </div>
      )}

      <SectionContent>{children}</SectionContent>
    </StyledSection>
  );
};

export const ArticleSection = ({ children, ...rest }: ISectionProps) => {
  return (
    <StyledArticle {...rest}>
      <SectionContent>{children}</SectionContent>
    </StyledArticle>
  );
};
