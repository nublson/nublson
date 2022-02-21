import useSWR from "swr";
import { api } from "../services/api";

const fetchMembers = async (url: string) => {
  const res = await api.get(url);

  return res.data.members;
};

export const useMembers = () => {
  const { data } = useSWR("/community/members", fetchMembers);

  return data;
};
