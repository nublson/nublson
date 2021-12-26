import { NextPage } from "next";
import { NextSeo } from "next-seo";
import HomeSection from "../section/Home";
import pageData from "../utils/pageData.json";

const Home: NextPage = () => {
  return (
    <>
      <NextSeo
        title="Page not found | Nubelson Fernandes"
        description={pageData.notFound.description}
        openGraph={{
          title: "Page not found | Nubelson Fernandes",
          description: pageData.notFound.description,
          images: [
            {
              url: pageData.notFound.image,
              width: 1920,
              height: 1080,
              alt: pageData.notFound.title,
            },
          ],
          site_name: "Page not found | Nubelson Fernandes",
          type: "website",
        }}
      />

      <HomeSection
        id="404"
        top={pageData.notFound.top}
        title={pageData.notFound.title}
        subtitle={pageData.notFound.description}
        image={pageData.notFound.image}
      />
    </>
  );
};

export default Home;
