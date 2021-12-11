import axios from "axios";

const api = axios.create({
  baseURL: "https://api.unsplash.com",
  params: {
    client_id: process.env.UNSPLASH_ACCESS_TOKEN,
  },
});

export const getUnsplashViews = async () => {
  const { data } = await api.get(`/users/nublson/statistics`);

  return data.views.historical.change;
};
