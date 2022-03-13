import { NextPage } from "next";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import pageData from "../utils/pageData.json";

const HomeSection = dynamic(() => import("../section/Home"));
const GallerySection = dynamic(() => import("../section/Gallery"));
const ShareSection = dynamic(() => import("../section/Share"));
const ContactSection = dynamic(() => import("../section/Contact"));

const Photography: NextPage = () => {
  const { asPath } = useRouter();

  return (
    <>
      <NextSeo
        title="Photography | Nubelson Fernandes"
        description={pageData.photography.description}
        canonical={`${process.env.BASE_URL}${asPath}`}
        openGraph={{
          url: `${process.env.BASE_URL}${asPath}`,
          title: "Photography | Nubelson Fernandes",
          description: pageData.photography.description,
          images: [
            {
              url: pageData.photography.image,
              width: 1920,
              height: 1080,
              alt: pageData.photography.title,
            },
          ],
          site_name: "Photography | Nubelson Fernandes",
          type: "website",
        }}
      />

      <HomeSection
        title={pageData.photography.title}
        subtitle={pageData.photography.description}
      />
      <GallerySection />
      <ShareSection title="Share my photography on" />
      <ContactSection />
    </>
  );
};

export default Photography;
