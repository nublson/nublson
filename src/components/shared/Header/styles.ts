import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding: 0 2rem;
  background-color: ${(props) => props.theme.colors.background};

  position: absolute;
  top: 5rem;
  left: 0;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  @media ${(props) => props.theme.mediaQueries.small} {
    z-index: 100;
    padding: 3rem 2rem 1rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    top: 0;
  }
`;
