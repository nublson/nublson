import { ReactNode } from "react";

import { Container } from "./styles";

interface ShareLinkProps {
  on: "facebook" | "twitter" | "whatsapp";
  content: string;
  children: ReactNode;
}

function ShareLink({ on, content, children }: ShareLinkProps) {
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
