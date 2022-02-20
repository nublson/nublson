import useSWR from "swr";
import { fetchViews } from "../services/unsplash";
import { fetchSubscribers } from "../services/youtube";
import { fetchCommunity } from "../services/buyMeACoffee";

export const useUnsplash = () => {
  const { data } = useSWR("nublson", fetchViews);

  return data;
};

export const useYoutube = () => {
  const { data } = useSWR("/channels", fetchSubscribers);

  return data;
};

export const useCommunity = () => {
  const { data } = useSWR("subscriptions", fetchCommunity);

  return data;
};
