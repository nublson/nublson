import styled from "styled-components";

export const Container = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  width: 100%;
  padding: 2rem 2rem 1rem;
  background-color: ${(props) => props.theme.colors.background};
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.35);

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    padding: 2rem 2rem 1rem;
  }

  .content {
    width: 100%;
    max-width: 121.8rem;
    margin: 0 auto;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
