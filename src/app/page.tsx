import { Header, LastPosts, WorkSection } from "../sections";

import { getData } from "@/services/notion";

import work from "@/utils/work.json";

export default async function Home() {
  const articles = await getData(process.env.NOTION_DATABASE_ARTICLES_ID);
  const products = await getData(process.env.NOTION_DATABASE_PRODUCTS_ID);

  return (
    <>
      <Header
        label="Scelerisque pellentesque"
        title="Lorem ipsum dolor sit amet consectetur."
        thumbnail="https://res.cloudinary.com/nublson/image/upload/v1687615248/Portfolio/Pages/AnyConv.com__Profile_Horizontal_Hight_nudv1c.webp"
        description="Sed feugiat diam aliquet libero. Urna ut id nisi in dis sed. Quisque leo enim pretium sapien velit arcu fermentum. Fermentum egestas duis elementum diam nullam tortor risus praesent."
      />
      <WorkSection workList={work.items} />
      <LastPosts
        title="Morbi massa lectus sem sagittis adipiscing posuere neque id odio."
        type="articles"
        posts={[articles[0], articles[1]]}
        linkTo="/blog"
      />
      <LastPosts
        title="Viverra gravida odio amet nulla aliquet convallis."
        type="products"
        posts={[products[0], products[1]]}
        linkTo="/store"
      />
    </>
  );
}
