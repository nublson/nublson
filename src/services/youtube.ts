import { unstable_cache } from "next/cache";
import axios from "axios";
import he from "he";
import { PostCardItemProps } from "@/utils/types";

interface YoutubeVideoRequestProps {
  channelId: string;
  maxResults: number;
}

export const getChannelVideos = unstable_cache(
  async ({
    channelId,
    maxResults,
  }: YoutubeVideoRequestProps): Promise<PostCardItemProps[]> => {
    try {
      const { data } = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            key: process.env.YOUTUBE_API_KEY,
            channelId,
            part: "snippet,id",
            order: "date",
            maxResults,
          },
        }
      );

      return (
        data.items.map((video: any) => {
          const thumbnails = video.snippet.thumbnails;
          const thumbnailUrl =
            thumbnails.maxres?.url ||
            thumbnails.high?.url ||
            thumbnails.medium?.url ||
            thumbnails.default?.url;

          return {
            id: video.id.videoId,
            title: he.decode(video.snippet.title),
            thumbnail: thumbnailUrl,
            publish_date: video.snippet.publishedAt,
            path: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          };
        }) || []
      );
    } catch (error: any) {
      console.error(
        "Erro ao buscar vídeos do YouTube:",
        error?.response?.data || error.message
      );
      return [];
    }
  },
  ["youtube-channel-videos"],
  { revalidate: 1800 }
);
