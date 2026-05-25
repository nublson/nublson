import type { PostMetadata } from "@/utils/formatter";
import { formatDateTimeIso } from "@/utils/formatter";
import { JsonLd } from "./json-ld";

type PersonProperty = "author" | "creator";
type TitleProperty = "headline" | "name";

type DatabasePostJsonLdProps = {
  slug: string;
  metadata: PostMetadata;
  schemaType: "BlogPosting" | "CreativeWork";
  routePrefix: "blog" | "work";
  titleProperty: TitleProperty;
  personProperty: PersonProperty;
  extraData?: (metadata: PostMetadata) => Record<string, unknown>;
};

export function DatabasePostJsonLd({
  slug,
  metadata,
  schemaType,
  routePrefix,
  titleProperty,
  personProperty,
  extraData,
}: DatabasePostJsonLdProps) {
  const pageUrl = `${process.env.BASE_URL}/${routePrefix}/${slug}`;
  const person = {
    "@type": "Person",
    name: metadata.author,
    url: process.env.BASE_URL,
  };

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": schemaType,
        [titleProperty]: metadata.title,
        description: metadata.description,
        image: metadata.thumbnail,
        datePublished: formatDateTimeIso(metadata.published_date),
        dateModified: formatDateTimeIso(metadata.updated_date),
        url: pageUrl,
        [personProperty]: person,
        publisher: person,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
        },
        ...(extraData ? extraData(metadata) : {}),
      }}
    />
  );
}
