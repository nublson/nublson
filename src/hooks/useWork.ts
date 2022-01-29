import useSWR from "swr";
import { unsplashFetcher } from "../services/unsplash";
import { youtubeFetcher } from "../services/youtube";

export const useUnsplash = () => {
  const { data } = useSWR("nublson", unsplashFetcher);

  return data;
};

export const useYoutube = () => {
  const { data } = useSWR("/channels", youtubeFetcher);

  return data;
};
