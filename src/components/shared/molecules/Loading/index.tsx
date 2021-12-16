import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Container } from "./styles";
import Loader from "react-loader-spinner";

function Loading() {
  return (
    <Container>
      <Loader type="ThreeDots" color="#fcfcfc" height={50} width={50} />
    </Container>
  );
}

export default Loading;
