import { Header, WorkSection } from "../sections";

import work from "../utils/work.json";

export default function Home() {
  return (
    <>
      <Header
        label="Scelerisque pellentesque"
        title="Lorem ipsum dolor sit amet consectetur."
        description="Sed feugiat diam aliquet libero. Urna ut id nisi in dis sed. Quisque leo enim pretium sapien velit arcu fermentum. Fermentum egestas duis elementum diam nullam tortor risus praesent."
      />
      <WorkSection workList={work.items} />
    </>
  );
}
