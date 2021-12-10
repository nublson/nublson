import styled from "styled-components";

interface TextProps {
  annotations: {
    bold?: boolean;
    code?: boolean;
    color?: "default" | string;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
  };
}

export const Container = styled.div``;
