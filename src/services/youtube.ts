import axios from "axios";

export const youtube = axios.create({
  baseURL: "https://youtube.googleapis.com/youtube/v3",
  params: {
    key: process.env.YOUTUBE_API_KEY,
  },
});
