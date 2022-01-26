import { Container } from "./styles";

interface KitProps {
  kitUrl: string;
}

function KitIframe({ kitUrl }: KitProps) {
  return (
    <Container src={`https://kit.co/embed?url=${kitUrl}`} scrolling="no" />
  );
}

export default KitIframe;
