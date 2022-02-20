import axios from "axios";
import { formatNumbers } from "../utils/formatter";

const unsplash = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_TOKEN}`,
  },
});

export const fetchViews = (username: string) => {
  const views = unsplash
    .get(`/users/${username}/statistics`)
    .then(({ data }) => {
      const value = data.views.historical.change;

      return formatNumbers(value);
    });

  return views;
};
