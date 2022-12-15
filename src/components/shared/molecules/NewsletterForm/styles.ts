import { Form } from "@unform/web";
import styled from "styled-components";


export const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    width: 90%;

    align-items: center;
  }

  iframe{
    width: 100%;
    border: none;
  }
`;
