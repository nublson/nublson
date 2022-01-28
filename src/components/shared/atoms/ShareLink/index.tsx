import { IShareLinkProps } from "../../../../utils/types";
import { Container } from "./styles";

function ShareLink({ on, content, children }: IShareLinkProps) {
  return (
    <Container
      href={
        on === "facebook"
          ? `https://www.facebook.com/sharer/sharer.php?u=${content}`
          : on === "twitter"
          ? `https://twitter.com/intent/tweet?url=${content}`
          : `https://wa.me/?text=${content}`
      }
      target="_blank"
      rel="noopener"
    >
      {children}
    </Container>
  );
}

export default ShareLink;
