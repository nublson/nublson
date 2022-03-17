import styled from "styled-components";

export const StyledTextLarge = styled.p`
  font-size: 2.4rem;
  line-height: 38px;

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    font-size: 2rem;
    line-height: 32px;
  }
`;

export const StyledTextMedium = styled.p`
  font-size: 1.8rem;
  line-height: 25px;

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    font-size: 1.6rem;
    line-height: 25px;
  }
`;

export const StyledTextSmall = styled.p`
  font-size: 1.4rem;
  line-height: 28px;

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    line-height: 24px;
  }
`;

export const StyledTextXSmall = styled.p`
  font-size: 1.2rem;
  line-height: 28px;

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    font-size: 1.3rem;
    line-height: 24px;
  }
`;
