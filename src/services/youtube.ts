import axios from "axios";
import { cache } from "react";
import he from "he";
import { PostCardItemProps } from "@/utils/types";

interface YoutubeVideoRequestProps {
  channelId: string;
  maxResults: number;
}

interface YoutubeVideoProps {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      maxres?: { url: string };
      high?: { url: string };
      medium: { url: string };
      default?: { url: string };
    };
    publishedAt: string;
  };
}

export const getChannelVideos = cache(
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
        data.items.map((video: YoutubeVideoProps) => {
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
  }
);
