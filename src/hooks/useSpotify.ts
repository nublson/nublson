import useSWR from "swr";
import { api } from "../services/api";

const fetchMusic = async (url: string) => {
  const response = await api.get(url);

  return response.data;
};

export const useMusic = () => {
  const { data } = useSWR("/spotify/playing", fetchMusic, {
    refreshInterval: 3000,
  });

  return data;
};
