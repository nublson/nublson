import axios from "axios";
import { formatNumbers } from "../utils/formatter";

export const github = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
  },
});

export const githubFetcher = async (data: string) => {
  const response = await github.get(`/user/${data}`);

  return response.data.length;
};
