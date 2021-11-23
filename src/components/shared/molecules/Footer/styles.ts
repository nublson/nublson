import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 10rem;
  background-color: ${(props) => props.theme.colors.off_white};
  color: ${(props) => props.theme.colors.off_black};

  display: flex;
  align-items: center;
  justify-content: center;

  .content {
    width: 100%;
    max-width: 121.8rem;
    margin: 0 auto;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
