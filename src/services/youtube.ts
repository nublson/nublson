import axios from "axios";

const api = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    key: process.env.YOUTUBE_ACCESS_TOKEN,
  },
});

export const getYoutubeSubscriptions = async () => {
  const { data } = await api.get("/channels", {
    params: {
      part: "statistics",
      id: "UC0kP3MzeS1re1XqQ7ebKIrA",
    },
  });

  return data.items[0].statistics.subscriberCount;
};
