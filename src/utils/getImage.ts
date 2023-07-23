import { getPlaiceholder } from "plaiceholder";

export const getSingleImage = async (src: string) => {
  const buffer = await fetch(src).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );

  const {
    base64,
    metadata: { width, height },
  } = await getPlaiceholder(buffer);

  return {
    base64,
    img: { src, width, height },
  };
};
