import useSWR from "swr";
import { api } from "../services/api";

const fetchIssues = async (url: string) => {
  const res = await api.get(url);

  return res.data.issues;
};

const fetchSubscribers = async (url: string) => {
  const res = await api.get(url);

  return res.data.subscribers;
};

export const useIssue = () => {
  const { data } = useSWR("/newsletter/issues", fetchIssues);

  return data;
};

export const useSubscribers = () => {
  const { data } = useSWR("/newsletter/subscribers", fetchSubscribers);

  return data;
};
