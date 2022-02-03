import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin: 2rem 0 0;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  h3 {
    margin: 1rem 0;
  }
`;

export const PodcastContainer = styled.iframe`
  display: block;
  border: 0;
  margin: 2rem 0 0;
  width: 100%;
  height: 17rem;

  @media ${(props) => props.theme.mediaQueries.large} {
    height: 11rem;
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    height: 11.5rem;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    height: 12rem;
  }
`;
