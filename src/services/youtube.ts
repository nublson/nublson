import axios from "axios";
import { formatNumbers } from "../utils/formatter";

const youtube = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    key: process.env.YOUTUBE_API_KEY,
  },
});

export const fetchSubscribers = (url: string) => {
  const subscribers = youtube
    .get(url, {
      params: {
        part: "statistics",
        id: process.env.YOUTUBE_CHANNEL_ID,
      },
    })
    .then(({ data }) => {
      const value = data.items[0].statistics.subscriberCount;

      return formatNumbers(value);
    });

  return subscribers;
};
