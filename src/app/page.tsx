import { Header, LastPosts, WorkSection } from "../sections";

import { LastArticles, LastProducts } from "@/mocks";

import work from "@/utils/work.json";

export default function Home() {
  return (
    <>
      <Header
        label="Scelerisque pellentesque"
        title="Lorem ipsum dolor sit amet consectetur."
        description="Sed feugiat diam aliquet libero. Urna ut id nisi in dis sed. Quisque leo enim pretium sapien velit arcu fermentum. Fermentum egestas duis elementum diam nullam tortor risus praesent."
      />
      <WorkSection workList={work.items} />
      <LastPosts
        title="Morbi massa lectus sem sagittis adipiscing posuere neque id odio."
        type="articles"
        posts={LastArticles}
        linkTo="/blog"
      />
      <LastPosts
        title="Viverra gravida odio amet nulla aliquet convallis."
        type="products"
        posts={LastProducts}
        linkTo="/store"
      />
    </>
  );
}
