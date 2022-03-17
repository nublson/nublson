import styled from "styled-components";

export const KitContainer = styled.iframe`
  display: block;
  border: 0;
  margin: 2rem 0 0;
  width: 100%;
  height: 70rem;
  max-width: 70rem;
  max-height: 70rem;

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    max-height: 45rem;
  }

  @media ${(props) => props.theme.mediaQueries.smaller} {
    max-height: 40rem;
  }

  @media ${(props) => props.theme.mediaQueries.smallest} {
    max-height: 35rem;
  }
`;
