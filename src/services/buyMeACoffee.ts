import axios from "axios";

const buyMeACoffee = axios.create({
  baseURL: "https://developers.buymeacoffee.com/api/v1",
  headers: {
    Authorization: `Bearer ${process.env.BUY_ME_A_COFFEE_ACCESS_TOKEN}`,
  },
});

export const getMembers = async (status?: string) => {
  const response = await buyMeACoffee.get(
    `/subscriptions?status=${!status ? "active" : status}`
  );

  return response;
};
