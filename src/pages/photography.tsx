import { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import cloudinary from "../services/cloudinary";
import { formatCloudinaryImages } from "../utils/formatter";
import pageData from "../utils/pageData.json";
import { IGalleryItem } from "../utils/types";

const HomeSection = dynamic(() => import("../section/Home"));
const GallerySection = dynamic(() => import("../section/Gallery"));
const ShareSection = dynamic(() => import("../section/Share"));
const ContactSection = dynamic(() => import("../section/Contact"));

type PhotographyProps = {
  gallery: IGalleryItem[];
};

const Photography: NextPage<PhotographyProps> = ({ gallery }) => {
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
      <GallerySection gallery={gallery} />
      <ShareSection title="Share my photography work on" />
      <ContactSection />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const results = await cloudinary.api.resources(
    {
      type: "upload",
      prefix: "Portfolio/Gallery",
      max_results: 40,
    },
    (error, result) => {
      return result.resources;
    }
  );

  const gallery = formatCloudinaryImages(
    JSON.parse(JSON.stringify(results.resources))
  );

  return {
    props: {
      gallery,
    },

    revalidate: 5,
  };
};

export default Photography;
