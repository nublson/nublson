import { getPlaiceholder } from "plaiceholder";

export const getRemoteImage = async (src: string) => {
  try {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from ${src}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    const {
      base64,
      metadata: { width, height },
    } = await getPlaiceholder(buffer);

    return {
      base64,
      img: { src, width, height },
    };
  } catch (error) {
    console.error("Error fetching or processing image:", error);
    throw error;
  }
};
