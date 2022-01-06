import { NextPage } from "next";
import { NextSeo } from "next-seo";
import HomeSection from "../section/Home";
import pageData from "../utils/pageData.json";

const Offline: NextPage = () => {
  return (
    <>
      <NextSeo
        title="Offline | Nubelson Fernandes"
        description={pageData.offline.description}
        openGraph={{
          title: "Offline | Nubelson Fernandes",
          description: pageData.offline.description,
          images: [
            {
              url: pageData.offline.image,
              width: 1920,
              height: 1080,
              alt: pageData.offline.title,
            },
          ],
          site_name: "Offline | Nubelson Fernandes",
          type: "website",
        }}
      />

      <HomeSection
        id="500"
        top={pageData.offline.top}
        title={pageData.offline.title}
        subtitle={pageData.offline.description}
        image={pageData.offline.image}
      />
    </>
  );
};

export default Offline;
