import { IKitProps } from "../../../../utils/types";
import { KitContainer } from "./styles";

function KitIframe({ url }: IKitProps) {
  return (
    <KitContainer
      src={`https://kit.co/embed?url=${url}`}
      scrolling="no"
      title="kit"
    />
  );
}

export default KitIframe;
