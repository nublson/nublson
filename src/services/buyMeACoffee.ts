import axios from "axios";
import { formatNumbers } from "../utils/formatter";

const buyMeACoffee = axios.create({
  baseURL: "https://developers.buymeacoffee.com/api/v1",
  headers: {
    Authorization: `Bearer ${process.env.BUY_ME_A_COFFEE_ACCESS_TOKEN}`,
  },
});

export const fetchCommunity = async (
  communityType: "subscriptions" | "supporters"
) => {
  const response = await buyMeACoffee.get(
    `/${communityType}${communityType === "subscriptions" && "?status=active"}`
  );

  if (response.data.error) {
    return 0;
  }

  return formatNumbers(response.data.total);
};
