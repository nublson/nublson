import { IKitProps } from "../../../../utils/types";
import { Container } from "./styles";

function KitIframe({ kitUrl }: IKitProps) {
  return (
    <Container
      src={`https://kit.co/embed?url=${kitUrl}`}
      scrolling="no"
      title="kit"
    />
  );
}

export default KitIframe;
