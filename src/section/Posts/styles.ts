import { Form } from "@unform/web";
import styled from "styled-components";

interface PostListProps {
  center?: boolean;
}

export const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10rem;

  @media ${(props) => props.theme.mediaQueries.medium} {
    gap: 8rem;
  }
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
`;

export const StyledForm = styled(Form)`
  width: 60%;
  margin: 0 auto;
  height: 100%;
  padding: 0.5rem;

  border: 1px solid ${(props) => props.theme.colors.line};
  background-color: ${(props) => props.theme.colors.input_background};

  display: flex;
  align-items: center;
  justify-content: center;

  & > :first-child {
    flex: 1;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    width: 85%;
  }
`;

export const CategorySection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
`;

export const PostList = styled.div<PostListProps>`
  width: 100%;
  height: 100%;
  text-align: center;

  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
`;
