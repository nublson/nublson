import styled from "styled-components";

export const StyledTitleLarge = styled.h1`
  color: ${(props) => props.theme.colors.title};
  font-size: 6.4rem;
  line-height: 66px;
  font-weight: 700;

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    font-size: 3.6rem;
    line-height: 36px;
  }
`;

export const StyledTitleMedium = styled.h2`
  color: ${(props) => props.theme.colors.title};
  font-size: 4.8rem;
  line-height: 50px;
  font-weight: 700;

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    font-size: 2.4rem;
    line-height: 32px;
  }
`;

export const StyledTitleSmall = styled.h3`
  color: ${(props) => props.theme.colors.title};
  font-size: 3.2rem;
  line-height: 34px;
  font-weight: 700;

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    font-size: 2.2rem;
    line-height: 32px;
  }
`;
