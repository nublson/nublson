import axios from "axios";
import { formatNumbers } from "../utils/formatter";

export const github = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
  },
});

export const githubFetcher = (data: string) => {
  const repos = github.get(`/user/${data}`).then(({ data }) => {
    const publicRepos = data.length;

    return formatNumbers(publicRepos);
  });

  return repos;
};
