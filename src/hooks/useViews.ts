import useSWR from "swr";
import { IViews } from "../utils/types";

const viewsFetcher = async (url: string) => {
  const res = await fetch(url);

  return res.json();
};

export const useViews = (slug: string) => {
  const { data } = useSWR<IViews>(`/api/views/${slug}`, viewsFetcher);

  return data?.views;
};
